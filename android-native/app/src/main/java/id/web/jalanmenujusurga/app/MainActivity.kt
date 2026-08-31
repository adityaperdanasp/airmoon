package id.web.jalanmenujusurga.app

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.GeolocationPermissions
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.firebase.messaging.FirebaseMessaging

// The one screen this app has: a full-screen WebView pointed at the real
// deployed web app (same site as the browser/PWA version — this native
// shell exists purely to get a real custom-sound notification channel,
// not to duplicate any UI). See FcmService.kt for the actual notification
// handling this app exists for.
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    // Any link whose host isn't one of these gets handed off to the
    // system browser/app instead of loaded inside this WebView — most
    // importantly Google Forms (the "Daftarkan Masjid" mosque-registration
    // form's photo-upload question fails inside embedded WebViews the same
    // way it fails inside WhatsApp's in-app browser, a real bug hit and
    // diagnosed earlier building the web app) and WhatsApp/Maps deep links,
    // none of which are meant to be "inside the app" anyway.
    private val ownHosts = setOf(
        "airmoon.vercel.app",
        "airmoon-d9620.web.app",
        "jalanmenujusurga.web.id",
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        requestRuntimePermissionsUpfront()

        webView = findViewById(R.id.webview)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.databaseEnabled = true
        webView.settings.mediaPlaybackRequiresUserGesture = false
        // Tagged so the web app's own JS (lib/notifications.js) can tell
        // it's running inside this native shell and skip the browser-only
        // VAPID/getToken() web-push flow, which doesn't apply in a WebView.
        webView.settings.userAgentString = webView.settings.userAgentString + " AirmoonNativeApp/1.0"

        webView.addJavascriptInterface(AndroidBridge(), "AndroidBridge")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: android.webkit.WebResourceRequest): Boolean {
                val url = request.url
                if (ownHosts.contains(url.host)) return false // let the WebView handle it
                startActivity(Intent(Intent.ACTION_VIEW, url))
                return true
            }

            override fun onPageFinished(view: WebView, url: String?) {
                super.onPageFinished(view, url)
                TokenHolder.token?.let { injectToken(it) }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onGeolocationPermissionsShowPrompt(
                origin: String,
                callback: GeolocationPermissions.Callback
            ) {
                val granted = ContextCompat.checkSelfPermission(
                    this@MainActivity, Manifest.permission.ACCESS_FINE_LOCATION
                ) == PackageManager.PERMISSION_GRANTED
                // The actual system location permission dialog already
                // fired from requestRuntimePermissionsUpfront() before the
                // page ever loaded — this just reports the current grant
                // state back to the page, true or false, rather than
                // trying to prompt again mid-page-load.
                callback.invoke(origin, granted, false)
            }
        }

        webView.loadUrl("https://airmoon.vercel.app")

        // Get whatever token Firebase currently has (cached or freshly
        // generated) — onNewToken() in FcmService only fires on the
        // *first* token ever issued or on a later rotation, not on every
        // app launch, so this is the only reliable way to also cover "the
        // token already existed before this Activity ever ran".
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (task.isSuccessful) {
                task.result?.let {
                    TokenHolder.token = it
                    runOnUiThread { injectToken(it) }
                }
            }
        }
        TokenHolder.onTokenRefreshed = { token -> runOnUiThread { injectToken(token) } }
    }

    private fun requestRuntimePermissionsUpfront() {
        val perms = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            perms.add(Manifest.permission.POST_NOTIFICATIONS)
        }
        val notGranted = perms.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (notGranted.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, notGranted.toTypedArray(), 1001)
        }
    }

    private fun injectToken(token: String) {
        val escaped = token.replace("\\", "\\\\").replace("'", "\\'")
        webView.evaluateJavascript(
            "window.__airmoonNativeToken && window.__airmoonNativeToken('$escaped');",
            null
        )
    }

    // Exposed to the page's JS as `window.AndroidBridge`. Currently just
    // lets the web app ask for a re-push of the current token (e.g. if the
    // page loaded before Firebase finished handing one back) — kept
    // narrow on purpose, not a general-purpose native API surface.
    inner class AndroidBridge {
        @android.webkit.JavascriptInterface
        fun requestFcmToken() {
            TokenHolder.token?.let { runOnUiThread { injectToken(it) } }
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }
}
