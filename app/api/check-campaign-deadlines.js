// Vercel serverless function — the daily admin/user checks that don't need
// anything finer-grained than once a day: (1) campaign deadlines that just
// passed (admin Telegram alert), (2) zakat maal haul countdowns that just
// completed, (3) the Friday Al-Kahf reminder, (4) the monthly donation
// pledge reminder, (5) the Zakat Fitrah reminder (last 5 days of Ramadan),
// (6) the Puasa Sunnah reminder (Senin/Kamis + Ayyamul Bidh), (7) the
// daily "Kutipan Hari Ini" push, (8) the monthly sedekah recap, (9) the
// monthly Zakat Penghasilan reminder, (10) crediting a referrer's
// referralCount once their referral's signup has landed (2026-09-12 —
// see lib/referral.js), and (11) a combined digest of new
// campaignRequests/umrohLeads/supportRequests submissions, (12) a weekly
// (Sunday) personal recap push combining streaks + this-week's sedekah,
// (13) 3 more Islamic-calendar moments (Maulid Nabi, 1 Muharram, Hari
// Arafah) that previously got no reminder at all, and (14) a daily
// referral-leaderboard snapshot (all 2026-09-12) — everything but (1),
// (11), and (14) is a real FCM push to the user themselves, (11) is a
// Telegram alert to the founder, (14) writes a small public Firestore
// doc. All fourteen live in one function/one cron entry deliberately —
// the Hobby plan caps a deployment at 12 Serverless Functions total, and
// this repo was already at that cap, so a separate daily-cron function
// for any one of these alone would have pushed a `vercel --prod` deploy
// over the limit (hit for real, 2026-09-02: "No more than 12 Serverless
// Functions can be added..."). None of the fourteen is time-sensitive
// enough to need its own schedule, so merging them costs nothing.
//
// Triggered once a day by Vercel's own native Cron Jobs (see the `crons`
// entry in vercel.json) rather than the external cron-job.org pinger
// send-prayer-notifications.js needs — a daily check is enough for both a
// one-time deadline and a haul measured in months, and Vercel's own Cron
// Jobs (daily-only on the Hobby plan) cover that fine.
//
// Auth accepts two forms so this works both from Vercel's own scheduler
// and from manual/testing calls: Vercel automatically sends
// `Authorization: Bearer <CRON_SECRET>` for cron-invoked functions when an
// env var literally named CRON_SECRET exists on the project (its own
// documented convention, specifically so the secret never has to be
// written into vercel.json, which is committed to the repo) — falls back
// to the same `?secret=`/`x-cron-secret` pattern send-prayer-
// notifications.js already uses for anyone testing this by hand.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { sendTelegramNotification } from './_lib/telegram.js';

const HAUL_DAYS = 354; // a Hijri (lunar) year, not the Gregorian 365 this app's dates otherwise run on

function daysSince(dateStr) {
  const start = new Date(`${dateStr}T00:00:00Z`);
  return Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
}

// Zakat maal is only due once wealth has stayed above nisab for a full
// haul — see lib/zakatHaul.js (client) for the countdown UI this backs.
async function checkZakatHaul(db) {
  const messaging = getMessaging();
  const snap = await db.collection('users').where('zakatHaul', '!=', null).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const haul = u.zakatHaul;
      const tokens = u.fcmTokens || [];
      if (!haul?.startDate || !tokens.length || u.notifPrefs?.pengingat === false) continue;

      const elapsed = daysSince(haul.startDate);
      const alreadyNotifiedThisCycle = haul.lastNotifiedCycle === haul.startDate;
      if (elapsed < HAUL_DAYS || alreadyNotifiedThisCycle) continue;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: {
          tag: 'zakat-haul',
          title: '🌙 Sudah 1 Haul',
          body: 'Harta kamu sudah mengendap 1 tahun di atas nisab — saatnya cek & bayar zakat maal.',
        },
      });

      await docSnap.ref.update({ 'zakatHaul.lastNotifiedCycle': haul.startDate });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { notified, errors };
}

// Sunnah Jumat reminder — surah Al-Kahf. Only fires when this cron's own
// run date (Asia/Jakarta, matching how the rest of this app reasons about
// "today" — see lib/prayerApi.js/nowInTimezone in send-prayer-
// notifications.js) is a Friday; every other day of the week this is a
// no-op. lastJumatReminderDate makes it idempotent per calendar date
// rather than per-run, so a manual re-trigger the same Friday doesn't
// double-send.
function todayInJakarta() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return { dateKey: `${get('year')}-${get('month')}-${get('day')}`, weekday: get('weekday') };
}

async function checkJumatReminder(db) {
  const { dateKey, weekday } = todayInJakarta();
  if (weekday !== 'Fri') return { skipped: 'not-friday' };

  const messaging = getMessaging();
  const snap = await db.collection('users').where('notifEnabled', '==', true).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const tokens = u.fcmTokens || [];
      if (!tokens.length || u.lastJumatReminderDate === dateKey || u.notifPrefs?.pengingat === false) continue;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: {
          tag: 'jumat-al-kahf',
          title: '📖 Selamat Hari Jumat',
          body: 'Yuk sempatkan baca Surah Al-Kahf hari ini — sunnah Rasulullah ﷺ tiap Jumat.',
        },
      });

      await docSnap.ref.update({ lastJumatReminderDate: dateKey });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { notified, errors };
}

// Monthly donation reminder (2026-09-04) — see lib/donations.js's
// watchMonthlyPledge for why this is a reminder push, not real recurring
// billing. Idempotent per calendar month via lastPledgeReminderMonth
// (Asia/Jakarta, same helper as the Jumat check below) rather than "30
// days since last reminder", so it can't drift later into the month on
// every run the way a rolling day-count would.
async function checkMonthlyPledgeReminders(db) {
  const { dateKey } = todayInJakarta();
  const monthKey = dateKey.slice(0, 7); // YYYY-MM
  const messaging = getMessaging();
  const snap = await db.collection('users').where('monthlyPledge.active', '==', true).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const pledge = u.monthlyPledge;
      const tokens = u.fcmTokens || [];
      // Sahabat airmoon supporters (2026-09-12) skip this specific nag —
      // a real perk for someone already financially supporting the app,
      // not a suppression of every donation-related push (campaign-funded
      // and sedekah-recap notifications still reach them normally).
      if (!tokens.length || !pledge?.amount || u.lastPledgeReminderMonth === monthKey || u.notifPrefs?.donasi === false || u.isSupporter) continue;

      const amountStr = `Rp ${Number(pledge.amount).toLocaleString('id-ID')}`;
      const result = await messaging.sendEachForMulticast({
        tokens,
        data: {
          tag: 'pledge-reminder',
          title: '🔔 Waktunya Donasi Bulanan',
          body: `Yuk lanjutkan sedekah rutin kamu bulan ini — ${amountStr}.`,
        },
      });

      await docSnap.ref.update({ lastPledgeReminderMonth: monthKey });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { notified, errors };
}

// Zakat Fitrah reminder (2026-09-04) — distinct from the existing Zakat
// Maal haul reminder above: fitrah has a hard calendar deadline (before
// the Idul Fitri prayer), not a rolling one-year countdown. Needs today's
// real Hijri date, which this file didn't have a way to get until now
// (the existing checks only need the Gregorian `todayInJakarta()` above) —
// Aladhan's `gToH` (Gregorian-to-Hijri) endpoint is a pure calendar
// conversion, no lat/lng needed, so this is a plain server-to-server call,
// not the IPv6-avoidance situation api/aladhan.js's proxy exists for
// (that's specifically about *browser* clients on IPv6-preferring
// networks; a Vercel function calling out has no such problem — confirmed
// live via curl before wiring this in). Fires once per Hijri year via
// lastZakatFitrahReminderYear, during the last 5 days of Ramadan (day >=
// month length - 4) — a real window before Eid, not just the final day,
// so there's still time to actually pay it.
const RAMADAN_HIJRI_MONTH_FITRAH = 9;

// Shared by both the Zakat Fitrah and Puasa Sunnah checks below — each
// used to make its own independent call to this, which worked but meant
// two network round-trips to the same endpoint on the same run for the
// same date. One call, reused.
let hijriCache = null;
async function fetchTodayHijri(dateKey) {
  if (hijriCache?.dateKey === dateKey) return hijriCache.hijri;
  const [year, month, day] = dateKey.split('-');
  const res = await fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`);
  if (!res.ok) throw new Error(`Aladhan gToH returned ${res.status}`);
  const json = await res.json();
  hijriCache = { dateKey, hijri: json.data.hijri };
  return json.data.hijri;
}

async function checkZakatFitrahReminder(db) {
  const { dateKey } = todayInJakarta();

  let hijri;
  try {
    hijri = await fetchTodayHijri(dateKey);
  } catch (err) {
    return { skipped: 'aladhan-unreachable', error: err.message };
  }

  const monthDays = Number(hijri.month.days) || 29;
  if (Number(hijri.month.number) !== RAMADAN_HIJRI_MONTH_FITRAH || Number(hijri.day) < monthDays - 4) {
    return { skipped: 'not-in-window' };
  }

  const hijriYear = hijri.year;
  const messaging = getMessaging();
  const snap = await db.collection('users').where('notifEnabled', '==', true).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const tokens = u.fcmTokens || [];
      if (!tokens.length || u.lastZakatFitrahReminderYear === hijriYear || u.notifPrefs?.pengingat === false) continue;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: {
          tag: 'zakat-fitrah',
          title: '🌙 Jangan Lupa Zakat Fitrah',
          body: 'Idul Fitri sudah dekat — yuk tunaikan zakat fitrah sebelum sholat Ied.',
        },
      });

      await docSnap.ref.update({ lastZakatFitrahReminderYear: hijriYear });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { notified, errors };
}

// Puasa Sunnah reminder (2026-09-04) — Senin/Kamis (weekly) and Ayyamul
// Bidh (Hijri 13-15 of any month), distinct from the Ramadan-specific
// Imsak reminder and the once-a-year Zakat Fitrah reminder above. Both
// conditions can in principle land on the same date (rare), so this sends
// at most one push per day mentioning whichever applies, rather than two.
// Idempotent per Gregorian date via lastPuasaSunnahReminderDate — a plain
// dateKey is enough here (unlike Zakat Fitrah's Hijri-year key), since
// this reminder is meant to repeat weekly/monthly, not once per cycle.
async function checkPuasaSunnahReminder(db) {
  const { dateKey, weekday } = todayInJakarta();
  const isSenin = weekday === 'Mon';
  const isKamis = weekday === 'Thu';

  let isAyyamulBidh = false;
  try {
    const hijri = await fetchTodayHijri(dateKey);
    const hijriDay = Number(hijri.day);
    isAyyamulBidh = hijriDay >= 13 && hijriDay <= 15;
  } catch {
    // Hijri lookup failing shouldn't block the plain Senin/Kamis check,
    // which needs no Hijri data at all.
  }

  if (!isSenin && !isKamis && !isAyyamulBidh) return { skipped: 'not-applicable-today' };

  const parts = [];
  if (isSenin || isKamis) parts.push(`Puasa Sunnah ${isSenin ? 'Senin' : 'Kamis'}`);
  if (isAyyamulBidh) parts.push('Ayyamul Bidh');
  const body = `Hari ini ${parts.join(' & ')} — yuk raih pahala puasa sunnah kalau belum niat dari malam.`;

  const messaging = getMessaging();
  const snap = await db.collection('users').where('notifEnabled', '==', true).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const tokens = u.fcmTokens || [];
      if (!tokens.length || u.lastPuasaSunnahReminderDate === dateKey || u.notifPrefs?.pengingat === false) continue;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: { tag: 'puasa-sunnah', title: '🌙 Puasa Sunnah Hari Ini', body },
      });

      await docSnap.ref.update({ lastPuasaSunnahReminderDate: dateKey });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { notified, errors };
}

// Daily "Kutipan Hari Ini" push (2026-09-04) — KutipanInspirasi.jsx's
// quote rotation was previously "there if you happen to open the page",
// never actually surfaced. Reuses the exact same day-of-year → QUOTE_REFS
// index math as lib/quotesApi.js's todaysQuoteIndex() (surah = index+15,
// ayat 1 — see data/quoteRefs.js), just computed from this file's own
// Jakarta-calendar dateKey instead of the client's local Date, and fetches
// the real Indonesian translation from the same Quran.com endpoint the
// client uses, so the notification body is never a fabricated quote.
function jakartaDayOfYear(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const start = Date.UTC(y, 0, 0);
  const current = Date.UTC(y, m - 1, d);
  return Math.floor((current - start) / 86400000);
}

async function checkDailyQuoteReminder(db) {
  const { dateKey } = todayInJakarta();
  const dayOfYear = jakartaDayOfYear(dateKey);
  const surah = (dayOfYear % 100) + 15; // matches data/quoteRefs.js exactly

  let body = 'Buka buat baca kutipan inspirasi hari ini.';
  try {
    const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surah}:1?translations=33`);
    const json = await res.json();
    const text = (json.verse?.translations?.find((t) => t.resource_id === 33)?.text || '').replace(/<[^>]+>/g, '');
    if (text) body = text.length > 140 ? `${text.slice(0, 137)}...` : text;
  } catch {
    // Falls back to the generic body above — the push still fires, just
    // without the actual quote text preview.
  }

  const messaging = getMessaging();
  const snap = await db.collection('users').where('notifEnabled', '==', true).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const tokens = u.fcmTokens || [];
      if (!tokens.length || u.lastQuoteReminderDate === dateKey || u.notifPrefs?.konten === false) continue;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: { tag: 'kutipan-harian', title: '📜 Kutipan Hari Ini', body },
      });

      await docSnap.ref.update({ lastQuoteReminderDate: dateKey });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { notified, errors };
}

// Monthly sedekah recap (2026-09-04) — a positive-reinforcement push
// distinct from the Pengingat Donasi Bulanan reminder above: that one
// proactively asks for a donation, this one recaps what someone has
// *already* given, once a month. Fires only on the 1st of the month
// (dateKey ends in -01), summing every contribution from the month that
// just ended via a collectionGroup query across all users' contributions
// subcollections in one call, rather than a per-user subcollection query
// — needs the createdAt collection-group index in firestore.indexes.json.
async function checkMonthlySedekahRecap(db) {
  const { dateKey } = todayInJakarta();
  const [yearStr, monthStr, dayStr] = dateKey.split('-');
  if (dayStr !== '01') return { skipped: 'not-first-of-month' };

  const year = Number(yearStr);
  const month = Number(monthStr); // 1-12, the month that just started
  const prevMonthStart = new Date(Date.UTC(month === 1 ? year - 1 : year, month === 1 ? 11 : month - 2, 1));
  const thisMonthStart = new Date(Date.UTC(year, month - 1, 1));
  const prevMonthLabel = prevMonthStart.toLocaleDateString('id-ID', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const monthKey = `${prevMonthStart.getUTCFullYear()}-${String(prevMonthStart.getUTCMonth() + 1).padStart(2, '0')}`;

  const contribSnap = await db
    .collectionGroup('contributions')
    .where('createdAt', '>=', prevMonthStart)
    .where('createdAt', '<', thisMonthStart)
    .get();

  const totals = new Map();
  for (const doc of contribSnap.docs) {
    const uid = doc.ref.parent.parent.id;
    totals.set(uid, (totals.get(uid) || 0) + (doc.data().amount || 0));
  }
  if (!totals.size) return { skipped: 'no-contributions' };

  const messaging = getMessaging();
  const notified = [];
  const errors = [];

  for (const [uid, total] of totals) {
    try {
      const userRef = db.collection('users').doc(uid);
      const userSnap = await userRef.get();
      const u = userSnap.data();
      if (!u) continue;
      const tokens = u.fcmTokens || [];
      if (!tokens.length || u.notifPrefs?.donasi === false || u.lastSedekahRecapMonth === monthKey) continue;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: {
          tag: 'sedekah-recap',
          title: '💝 Rekap Sedekah Bulan Lalu',
          body: `Alhamdulillah, total sedekah kamu ${prevMonthLabel}: Rp ${total.toLocaleString('id-ID')}. Terima kasih atas sedekahnya!`,
        },
      });

      await userRef.update({ lastSedekahRecapMonth: monthKey });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await userRef.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid, error: err.message });
    }
  }

  return { notified, errors, totalDonors: totals.size };
}

// Monthly Zakat Penghasilan reminder (2026-09-04) — distinct from the
// Zakat Maal haul reminder above (that one only fires once a full lunar
// year, this fires every month, matching how income zakat is actually
// paid). Fires on the 1st of the month, same as the sedekah recap check,
// but gated on an explicit per-user opt-in
// (zakatPenghasilanReminder.active) rather than everyone with
// notifEnabled — unlike the other reminders here, this one has no
// existing signal (a haul date, a pledge amount) implying someone wants
// it, so it needs its own real toggle (KalkulatorZakat.jsx).
async function checkZakatPenghasilanReminder(db) {
  const { dateKey } = todayInJakarta();
  const monthKey = dateKey.slice(0, 7); // YYYY-MM
  if (!dateKey.endsWith('-01')) return { skipped: 'not-first-of-month' };

  const messaging = getMessaging();
  const snap = await db.collection('users').where('zakatPenghasilanReminder.active', '==', true).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const tokens = u.fcmTokens || [];
      if (!tokens.length || u.notifPrefs?.pengingat === false || u.lastZakatPenghasilanReminderMonth === monthKey) continue;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: {
          tag: 'zakat-penghasilan',
          title: '💰 Waktunya Zakat Penghasilan',
          body: 'Sudah gajian bulan ini? Yuk hitung & tunaikan zakat penghasilanmu.',
        },
      });

      await docSnap.ref.update({ lastZakatPenghasilanReminderMonth: monthKey });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { notified, errors };
}

// Referral program (2026-09-12) — see lib/referral.js's own header for
// why crediting the REFERRER's reward can't happen from the referee's
// client session (firestore.rules only allows a user to write their own
// doc). This query only ever matches a user with a referral genuinely
// still pending reward, so it stays small regardless of total user count.
async function checkReferralRewards(db) {
  const snap = await db.collection('users').where('referralRewarded', '==', false).get();
  const rewarded = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      if (!u.referredBy) continue;
      const referrerRef = db.collection('users').doc(u.referredBy);
      const referrerSnap = await referrerRef.get();
      if (referrerSnap.exists) {
        await referrerRef.set({ referralCount: FieldValue.increment(1) }, { merge: true });
      }
      await docSnap.ref.set({ referralRewarded: true }, { merge: true });
      rewarded.push({ referee: docSnap.id, referrer: u.referredBy });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { rewarded, errors };
}

// Daily digest for 3 new lead-gen forms (2026-09-12): Ajukan Campaign
// Masjid, Minat Umroh, and "Hubungi Kami" support requests — see
// lib/leadForms.js and firestore.rules' matching comments for why none
// of these auto-publish/auto-respond. One combined Telegram message
// covering all three rather than three separate alerts, and folded into
// this existing daily cron rather than a new endpoint for the same
// 12-function Hobby-plan reason as every other check in this file — the
// real trade-off is a submission surfaces to the founder up to ~24h
// later, not instantly, which is an acceptable delay for a manually-
// reviewed form (unlike, say, a prayer-time push).
async function checkNewLeadFormsDigest(db) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [campaignSnap, umrohSnap, supportSnap] = await Promise.all([
    db.collection('campaignRequests').where('createdAt', '>=', since).get(),
    db.collection('umrohLeads').where('createdAt', '>=', since).get(),
    db.collection('supportRequests').where('createdAt', '>=', since).get(),
  ]);

  if (!campaignSnap.size && !umrohSnap.size && !supportSnap.size) {
    return { skipped: 'nothing-new' };
  }

  const lines = ['📋 Rekap pengajuan baru (24 jam terakhir):'];
  if (campaignSnap.size) {
    lines.push(`\n🕌 Ajukan Campaign Masjid (${campaignSnap.size}):`);
    campaignSnap.forEach((d) => lines.push(`- ${d.data().namaMasjid} (${d.data().lokasi || 'lokasi belum diisi'})`));
  }
  if (umrohSnap.size) {
    lines.push(`\n✈️ Minat Umroh (${umrohSnap.size}):`);
    umrohSnap.forEach((d) => lines.push(`- ${d.data().name || 'Tanpa nama'} · ${d.data().phone}`));
  }
  if (supportSnap.size) {
    lines.push(`\n💬 Hubungi Kami (${supportSnap.size}):`);
    supportSnap.forEach((d) => lines.push(`- ${d.data().subject || 'Tanpa subjek'}: ${(d.data().message || '').slice(0, 80)}`));
  }
  lines.push('\nCek Firestore console (campaignRequests / umrohLeads / supportRequests) untuk detail lengkap & tindak lanjut.');

  await sendTelegramNotification(lines.join('\n'));
  return { campaignRequests: campaignSnap.size, umrohLeads: umrohSnap.size, supportRequests: supportSnap.size };
}

// Rekap mingguan (2026-09-12) — a positive-reinforcement push, same
// spirit as the existing monthly sedekah recap but weekly and broader
// (streaks + sedekah in one message). Fires only on Sunday
// (Asia/Jakarta) — idempotent per calendar date is enough since that
// only happens once a week anyway. Reuses the exact same
// collectionGroup('contributions') date-range pattern
// checkMonthlySedekahRecap already established (same index, just a
// 7-day window instead of a full month) rather than trying to sum
// amalanHarian's per-day scores across all users, which has no indexed
// timestamp field to range-query on. Skips anyone with genuinely nothing
// to report this week — a blank "kamu belum ngapa-ngapain" recap would
// read as a nag, not a recap.
async function checkWeeklyRecapPush(db) {
  const { dateKey, weekday } = todayInJakarta();
  if (weekday !== 'Sun') return { skipped: 'not-sunday' };

  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const contribSnap = await db.collectionGroup('contributions').where('createdAt', '>=', weekStart).get();
  const sedekahTotals = new Map();
  for (const doc of contribSnap.docs) {
    const uid = doc.ref.parent.parent.id;
    sedekahTotals.set(uid, (sedekahTotals.get(uid) || 0) + (doc.data().amount || 0));
  }

  const messaging = getMessaging();
  const snap = await db.collection('users').where('notifEnabled', '==', true).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const tokens = u.fcmTokens || [];
      if (!tokens.length || u.lastWeeklyRecapDate === dateKey || u.notifPrefs?.konten === false) continue;

      const dzikirPagi = u.dzikirStreak?.pagi?.current || 0;
      const dzikirPetang = u.dzikirStreak?.petang?.current || 0;
      const reading = u.readingStreak?.current || 0;
      const sedekah = sedekahTotals.get(docSnap.id) || 0;
      if (!dzikirPagi && !dzikirPetang && !reading && !sedekah) continue;

      const parts = [];
      if (reading > 0) parts.push(`streak baca ${reading} hari`);
      if (dzikirPagi > 0 || dzikirPetang > 0) parts.push(`streak dzikir ${Math.max(dzikirPagi, dzikirPetang)} hari`);
      if (sedekah > 0) parts.push(`sedekah Rp ${sedekah.toLocaleString('id-ID')}`);
      const body = `Minggu ini: ${parts.join(', ')}. Alhamdulillah, terus lanjutkan!`;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: { tag: 'rekap-mingguan', title: '✨ Rekap Mingguan Kamu', body },
      });

      await docSnap.ref.update({ lastWeeklyRecapDate: dateKey });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { notified, errors };
}

// Kalender kampanye musiman (2026-09-12) — Ramadan already gets its own
// dedicated Imsak/Zakat-Fitrah treatment; this covers 3 more Islamic-
// calendar moments the app previously said nothing about at all: Maulid
// Nabi (12 Rabiul Awal), 1 Muharram (Islamic New Year), and Hari Arafah
// (9 Dzulhijjah, the day before Idul Adha). Same fetchTodayHijri +
// per-Hijri-year idempotency shape as checkZakatFitrahReminder above.
async function checkSeasonalReminders(db) {
  const { dateKey } = todayInJakarta();
  let hijri;
  try {
    hijri = await fetchTodayHijri(dateKey);
  } catch (err) {
    return { skipped: 'aladhan-unreachable', error: err.message };
  }

  const month = Number(hijri.month.number);
  const day = Number(hijri.day);
  const hijriYear = hijri.year;

  let occasion = null;
  if (month === 3 && day === 12) {
    occasion = { key: 'maulid-nabi', title: '🌙 Maulid Nabi Muhammad ﷺ', body: 'Hari ini 12 Rabiul Awal — perbanyak sholawat & kenang perjalanan hidup Rasulullah ﷺ.' };
  } else if (month === 1 && day === 1) {
    occasion = { key: 'tahun-baru-hijriah', title: '🌙 Selamat Tahun Baru Hijriah', body: `Memasuki 1 Muharram ${hijriYear} H — momen baik buat muhasabah & niat baru.` };
  } else if (month === 12 && day === 9) {
    occasion = { key: 'idul-adha', title: '🕋 Hari Arafah', body: 'Besok Idul Adha — hari ini puasa Arafah sangat dianjurkan buat yang tidak berhaji.' };
  }
  if (!occasion) return { skipped: 'not-in-window' };

  const fieldKey = `lastSeasonalReminder_${occasion.key}`;
  const messaging = getMessaging();
  const snap = await db.collection('users').where('notifEnabled', '==', true).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const tokens = u.fcmTokens || [];
      if (!tokens.length || u[fieldKey] === hijriYear || u.notifPrefs?.pengingat === false) continue;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: { tag: occasion.key, title: occasion.title, body: occasion.body },
      });

      await docSnap.ref.update({ [fieldKey]: hijriYear });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { occasion: occasion.key, notified, errors };
}

// Referral leaderboard snapshot (2026-09-12) — see lib/leaderboard.js for
// why this is a small public snapshot doc rather than a live client
// query over `users` (owner-read-only, and would over-expose referral
// counts even if it weren't). Only names + counts, no uid/email.
async function checkReferralLeaderboard(db) {
  const snap = await db.collection('users').where('referralCount', '>', 0).orderBy('referralCount', 'desc').limit(10).get();
  const top = snap.docs.map((d) => ({ name: d.data().displayName || 'Sahabat airmoon', count: d.data().referralCount }));
  await db.collection('leaderboards').doc('referral').set({ top, updatedAt: FieldValue.serverTimestamp() });
  return { count: top.length };
}

function initAdmin() {
  if (getApps().length) return;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) throw new Error('FIREBASE_SERVICE_ACCOUNT_B64 belum diset di Vercel.');
  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  initializeApp({ credential: cert(serviceAccount) });
}

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (req.headers.authorization === `Bearer ${secret}`) return true; // Vercel's own cron invocation
  const provided = req.query.secret || req.headers['x-cron-secret'];
  return provided === secret;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initAdmin();
    const db = getFirestore();
    const now = new Date();

    const snap = await db.collection('donations').where('status', '==', 'active').get();
    const notified = [];

    for (const docSnap of snap.docs) {
      const d = docSnap.data();
      if (!d.deadline || d.deadlineNotified) continue;

      const deadlineDate = new Date(d.deadline);
      if (Number.isNaN(deadlineDate.getTime()) || deadlineDate > now) continue;

      const collected = d.collected || 0;
      const target = d.target || 0;
      const percent = target > 0 ? Math.round((collected / target) * 100) : 0;

      await sendTelegramNotification(
        `⏰ Deadline campaign udah lewat!\n\n` +
          `${d.title}\n` +
          `Terkumpul: Rp ${collected.toLocaleString('id-ID')} dari target Rp ${target.toLocaleString('id-ID')} (${percent}%)\n` +
          `Batas waktu: ${deadlineDate.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n` +
          `Yuk cek & tindak lanjuti (perpanjang, tutup, atau arsipkan) campaign ini.`
      );

      await docSnap.ref.update({ deadlineNotified: true });
      notified.push({ id: docSnap.id, title: d.title });
    }

    const haulResult = await checkZakatHaul(db);
    const jumatResult = await checkJumatReminder(db);
    const pledgeResult = await checkMonthlyPledgeReminders(db);
    const fitrahResult = await checkZakatFitrahReminder(db);
    const puasaSunnahResult = await checkPuasaSunnahReminder(db);
    const quoteResult = await checkDailyQuoteReminder(db);
    const sedekahRecapResult = await checkMonthlySedekahRecap(db);
    const zakatPenghasilanResult = await checkZakatPenghasilanReminder(db);
    const referralResult = await checkReferralRewards(db);
    const leadFormsDigestResult = await checkNewLeadFormsDigest(db);
    const weeklyRecapResult = await checkWeeklyRecapPush(db);
    const seasonalResult = await checkSeasonalReminders(db);
    const referralLeaderboardResult = await checkReferralLeaderboard(db);

    return res.status(200).json({
      checked: snap.size,
      notified,
      zakatHaul: haulResult,
      jumatReminder: jumatResult,
      pledgeReminder: pledgeResult,
      zakatFitrah: fitrahResult,
      puasaSunnah: puasaSunnahResult,
      dailyQuote: quoteResult,
      sedekahRecap: sedekahRecapResult,
      zakatPenghasilan: zakatPenghasilanResult,
      referralRewards: referralResult,
      leadFormsDigest: leadFormsDigestResult,
      weeklyRecap: weeklyRecapResult,
      seasonalReminder: seasonalResult,
      referralLeaderboard: referralLeaderboardResult,
    });
  } catch (err) {
    console.error('check-campaign-deadlines error:', err);
    return res.status(500).json({ error: err.message || 'Gagal cek deadline campaign.' });
  }
}
