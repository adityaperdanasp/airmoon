package id.web.jalanmenujusurga.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

// Shared with MainActivity: the one place both sides read/write "the FCM
// token this device currently has", plus a callback MainActivity can set
// so a token generated *while the app is open* reaches the WebView
// immediately (see MainActivity.kt's TokenHolder.onTokenRefreshed).
object TokenHolder {
    var token: String? = null
    var onTokenRefreshed: ((String) -> Unit)? = null
}

// The entire reason this native app exists instead of just the TWA: this
// class is real Kotlin code that builds and shows the notification itself,
// on a channel with a bundled custom sound — something no web-push/TWA
// path can do (see CLAUDE.md's Android app notes for the full story of
// why the web/TWA route hit a hard ceiling here).
//
// There are 3 possible channels, one per AzanSound.ALL entry, not just
// one — a NotificationChannel's sound is locked in at creation, so
// letting someone switch between azan recordings means each recording
// needs its own permanent channel; onMessageReceived picks whichever
// channel matches the user's *currently saved* preference at the moment
// each notification actually fires (not whatever was selected when the
// channel was first created).
class FcmService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        TokenHolder.token = token
        TokenHolder.onTokenRefreshed?.invoke(token)
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)

        // Backend sends data-only messages deliberately (see
        // send-prayer-notifications.js) specifically so this method is
        // guaranteed to run for every push, foreground or background —
        // a `notification`-payload message would instead get shown
        // automatically by the OS using the default channel/sound,
        // bypassing this code (and the custom sound) entirely.
        val title = message.data["title"] ?: "airmoon"
        val body = message.data["body"] ?: ""
        val tag = message.data["tag"] ?: "airmoon-default"

        val soundId = AzanSound.getSelected(this)
        val channelId = AzanSound.channelIdFor(soundId)
        ensureChannel(soundId)

        val openIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this, tag.hashCode(), openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info) // TODO: swap for a proper monochrome status-bar icon
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        // notify(tag, id, ...) re-alerts (sound/vibration) every call by
        // default, even when reusing the same tag+id — unlike the Web
        // Notification API this app's web version hit (which stays silent
        // on a same-tag replace unless `renotify: true` is set). Nothing
        // extra needed here for that same "new day, same prayer, still
        // makes a sound" behavior to just work.
        NotificationManagerCompat.from(this).notify(tag, 0, notification)
    }

    private fun ensureChannel(soundId: String) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val channelId = AzanSound.channelIdFor(soundId)
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (manager.getNotificationChannel(channelId) != null) return

        val soundUri = Uri.parse("android.resource://$packageName/${AzanSound.rawResFor(soundId)}")
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_NOTIFICATION)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        val channel = NotificationChannel(
            channelId,
            "Pengingat Sholat (${AzanSound.labelFor(soundId)})",
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Notifikasi waktu sholat dengan suara ${AzanSound.labelFor(soundId)}"
            setSound(soundUri, audioAttributes)
            enableVibration(true)
        }
        manager.createNotificationChannel(channel)
    }
}
