import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { createGroup, joinGroupByCode, watchMyGroups, watchGroupMemberStats } from './groups';
import { fetchRecentAmalanHarian } from './amalanHarian';

// Tantangan Teman (2026-09-12) — reuses Grup Ibadah's exact underlying
// data model (groups/{id} + groupInvites/{code} + memberStats/{uid})
// rather than building new infrastructure: a "friend pair" is just a
// `groups` doc with `type: 'friend'` and (intended) 2 members instead of
// a named circle. See lib/groups.js's own header for why a live cross-
// user query isn't possible (`users/{uid}` is owner-read-only) and every
// member has to self-report instead — same constraint applies here.
//
// The 2-person cap is enforced CLIENT-SIDE only (checked before calling
// joinGroupByCode) — firestore.rules' `groups` update rule has no member
// -count ceiling of its own (it only validates "append exactly one uid,
// touch nothing else"), so this isn't airtight against someone bypassing
// the UI. Same low-stakes trust level as this app's other social
// features (no money, worst case a 3-person "friend pair").
const AUTO_NAME_SUFFIX = "'s Tantangan Teman";

export async function createFriendPair(user) {
  const name = `${(user.displayName || 'Sahabat airmoon').split(' ')[0]}${AUTO_NAME_SUFFIX}`;
  const { groupId, inviteCode } = await createGroup(user, name);
  await setDoc(doc(db, 'groups', groupId), { type: 'friend' }, { merge: true });
  return { groupId, inviteCode };
}

export async function joinFriendPairByCode(user, code, currentMemberCount) {
  if (currentMemberCount >= 2) throw new Error('Tantangan Teman cuma buat 2 orang — ini udah penuh.');
  return joinGroupByCode(user, code);
}

export function watchMyFriendPairs(uid, callback) {
  watchMyGroups(uid, (groups) => callback(groups.filter((g) => g.type === 'friend')));
}

export function watchFriendPairStats(groupId, callback) {
  return watchGroupMemberStats(groupId, callback);
}

// Computed fresh each report (not incremented) — a rolling 7-day sum,
// same fetchRecentAmalanHarian call RingkasanIbadah's own sparkline
// already makes, just summed instead of charted.
export async function reportMyWeeklyScore(groupId, user) {
  const recentDays = await fetchRecentAmalanHarian(user.uid, 7);
  const weeklyScore = recentDays.reduce((sum, d) => sum + d.score, 0);
  await setDoc(doc(db, 'groups', groupId, 'memberStats', user.uid), {
    displayName: user.displayName || user.email || 'Sahabat airmoon',
    weeklyScore,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export function watchGroupDoc(groupId, callback) {
  return onSnapshot(doc(db, 'groups', groupId), (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null));
}
