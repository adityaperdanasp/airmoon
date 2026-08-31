package id.web.jalanmenujusurga.app

import android.content.Context

// The 4 bundled azan sounds a user can pick between — deliberately named
// to match pages/PilihAdzan.jsx's list on the web side exactly (same 4
// labels), even though that web picker is cosmetic-only (the Web
// Notification API has no way to attach a custom sound at all, so its
// selection never actually controls playback — see CLAUDE.md). This is
// the one place a selection genuinely changes what plays.
//
// See android-native/README.md for exact sources/licenses of each
// res/raw file. Adding a 5th later means: drop the file in res/raw, add
// one line to ALL below, and give it a channel version suffix like the
// others — nothing else needs to change, FcmService/MainActivity both
// just iterate this list.
object AzanSound {
    const val MAKKAH = "makkah"
    const val MADINAH = "madinah"
    const val MISHARY = "mishary"
    const val BEEP = "beep"
    val ALL = listOf(MAKKAH, MADINAH, MISHARY, BEEP)
    const val DEFAULT = MAKKAH

    fun rawResFor(id: String): Int = when (id) {
        MADINAH -> R.raw.azan_madinah
        MISHARY -> R.raw.azan_mishary_placeholder
        BEEP -> R.raw.beep
        else -> R.raw.azan_makkah
    }

    // Versioned per-sound (not just one shared suffix) so replacing just
    // one of the files later only needs that one id bumped, not all four
    // — same "channel sound is locked at creation" reasoning as before.
    fun channelIdFor(id: String): String = "adzan_channel_${id}_v1"

    fun labelFor(id: String): String = when (id) {
        MADINAH -> "Adzan Madinah"
        MISHARY -> "Adzan Mishary Rasyid"
        BEEP -> "Nada Pengingat"
        else -> "Adzan Makkah"
    }

    private const val PREFS_NAME = "airmoon_prefs"
    private const val KEY_SELECTED = "azan_sound"

    fun getSelected(context: Context): String {
        val saved = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).getString(KEY_SELECTED, DEFAULT)
        return if (saved in ALL) saved!! else DEFAULT
    }

    fun setSelected(context: Context, id: String) {
        if (id !in ALL) return
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit().putString(KEY_SELECTED, id).apply()
    }

    // JSON built by hand (no JSON library dependency needed for 4 fixed,
    // hardcoded-safe strings) — consumed by the web app's Pengaturan page
    // to render the picker; see lib/notifications.js's getAzanSoundOptions().
    fun optionsJson(): String =
        ALL.joinToString(",", "[", "]") { "{\"id\":\"$it\",\"label\":\"${labelFor(it)}\"}" }
}
