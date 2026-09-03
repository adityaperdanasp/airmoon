// Notifies everyone who has ever contributed to a campaign once it
// actually reaches its funding target — a real gap before this: a donor
// had no way to find out whether "their" campaign succeeded short of
// manually revisiting Donasi.jsx and checking the progress bar. Called
// right after both real payment-crediting paths (midtrans-notify.js's
// webhook, confirm-manual-payment.js's confirm link) increment
// `collected`, since those are the only two places `collected` ever
// changes — no separate cron needed, this fires the moment it actually
// happens.
//
// `fundedNotified` on the donation doc makes this fire-once even though
// `collected` can keep incrementing past the target afterward (someone
// donating to an already-funded campaign shouldn't re-trigger the blast).
// Needs a collection-group index on contributions.donationId — see
// firestore.indexes.json.
import { getMessaging } from 'firebase-admin/messaging';
import { FieldValue } from 'firebase-admin/firestore';

export async function notifyDonorsIfFunded(db, donationId) {
  const donationRef = db.collection('donations').doc(donationId);
  const donationSnap = await donationRef.get();
  if (!donationSnap.exists) return;
  const donation = donationSnap.data();
  if (donation.fundedNotified) return;
  if (!donation.target || (donation.collected || 0) < donation.target) return;

  // Marked funded before the send loop, not after — a crash/timeout
  // mid-loop should never leave this re-triggerable on the next payment
  // for the same (already-funded) campaign.
  await donationRef.set({ fundedNotified: true }, { merge: true });

  const contribSnap = await db.collectionGroup('contributions').where('donationId', '==', donationId).get();
  const uids = [...new Set(contribSnap.docs.map((d) => d.ref.parent.parent.id))];
  if (!uids.length) return;

  const messaging = getMessaging();
  for (const uid of uids) {
    try {
      const userRef = db.collection('users').doc(uid);
      const userSnap = await userRef.get();
      const userData = userSnap.data() || {};
      const tokens = userData.fcmTokens || [];
      // Granular opt-out (2026-09-04, see lib/notifPrefs.js) — grouped
      // under 'donasi' alongside the monthly pledge reminder.
      if (!tokens.length || userData.notifPrefs?.donasi === false) continue;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: {
          tag: `campaign-funded-${donationId}`,
          title: '🎉 Campaign Tercapai!',
          body: `"${donation.title}" yang kamu dukung udah mencapai targetnya. Terima kasih atas sedekahnya!`,
        },
      });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await userRef.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }
    } catch (err) {
      // One donor's dead token/missing doc shouldn't stop the rest from
      // being notified.
      console.error('notifyDonorsIfFunded per-uid error:', uid, err);
    }
  }
}
