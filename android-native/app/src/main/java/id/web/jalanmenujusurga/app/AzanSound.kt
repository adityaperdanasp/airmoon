package id.web.jalanmenujusurga.app

import android.content.Context

// The 3 bundled azan recordings a user can pick between (see
// README.md for exact sources/licenses of each res/raw file). Adding a
// 4th later means: drop the file in res/raw, add one line to ALL below,
// and give it a channel version suffix like the others — nothing else
// needs to change, FcmService/MainActivity both just iterate this list.
object AzanSound {
    const val MAKKAH = "makkah"
    const val MADINAH = "madinah"
    const val LAINNYA = "lainnya"
    val ALL = listOf(MAKKAH, MADINAH, LAINNYA)
    const val DEFAULT = MAKKAH

    fun rawResFor(id: String): Int = when (id) {
        MADINAH -> R.raw.azan_madinah
        LAINNYA -> R.raw.azan_lainnya
        else -> R.raw.azan_makkah
    }

    // Versioned per-sound (not just one shared suffix) so replacing just
    // one of the three files later only needs that one id bumped, not
    // all three — same "channel sound is locked at creation" reasoning
    // as the single-channel version this replaced.
    fun channelIdFor(id: String): String = "adzan_channel_${id}_v1"

    fun labelFor(id: String): String = when (id) {
        MADINAH -> "Azan Madinah"
        LAINNYA -> "Azan Lainnya"
        else -> "Azan Makkah"
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

    // JSON built by hand (no JSON library dependency needed for 3 fixed,
    // hardcoded-safe strings) — consumed by the web app's Pengaturan page
    // to render the picker; see lib/notifications.js's getAzanSoundOptions().
    fun optionsJson(): String =
        ALL.joinToString(",", "[", "]") { "{\"id\":\"$it\",\"label\":\"${labelFor(it)}\"}" }
}
