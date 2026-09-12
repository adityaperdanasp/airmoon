import {
  collection, doc, addDoc, getDoc, getDocs, setDoc, updateDoc,
  query, where, onSnapshot, arrayUnion, serverTimestamp, increment,
} from 'firebase/firestore';
import { db } from './firebase';

// Grup Ibadah (2026-09-12) — small circles (family/pengajian) sharing
// dzikir/reading-streak numbers, an MVP scope deliberately kept small:
// no chat, no admin controls beyond create/join, no live cross-user
// query (users/{uid} is owner-read-only) — each member just self-reports
// their own current streak numbers into a shared subcollection whenever
// they open the group page. See firestore.rules' matching comments for
// the full security reasoning, especially the groupInvites indirection
// that makes joining-by-code possible without needing list/query access
// to the (member-only-readable) groups collection itself.
function randomInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I — easy to misread when shared verbally
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function createGroup(user, name) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Nama grup gak boleh kosong.');
  const groupRef = doc(collection(db, 'groups'));
  const inviteCode = randomInviteCode();
  await setDoc(groupRef, {
    name: trimmed,
    ownerUid: user.uid,
    memberUids: [user.uid],
    inviteCode,
    createdAt: serverTimestamp(),
  });
  // Separate write, not a batch — groupInvites' own create rule only
  // checks `groupId is string`, so there's no atomicity requirement
  // strict enough to need a batch here (a group with no invite pointer
  // yet just can't be joined by code until this second write lands,
  // which is effectively instant).
  await setDoc(doc(db, 'groupInvites', inviteCode), { groupId: groupRef.id });
  return { groupId: groupRef.id, inviteCode };
}

export async function joinGroupByCode(user, code) {
  const trimmedCode = code.trim().toUpperCase();
  if (!trimmedCode) throw new Error('Masukkan kode undangan.');
  const inviteSnap = await getDoc(doc(db, 'groupInvites', trimmedCode));
  if (!inviteSnap.exists()) throw new Error('Kode undangan gak ditemukan.');
  const { groupId } = inviteSnap.data();
  await updateDoc(doc(db, 'groups', groupId), { memberUids: arrayUnion(user.uid) });
  return groupId;
}

export function watchMyGroups(uid, callback) {
  if (!uid) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'groups'), where('memberUids', 'array-contains', uid));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export function watchGroup(groupId, callback) {
  return onSnapshot(doc(db, 'groups', groupId), (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null));
}

// Self-reported, not live — each member writes their own snapshot when
// they open the group page (see GrupIbadah.jsx), reusing the plain
// streak fields already sitting on their own users/{uid} doc rather than
// a real-time cross-user subscription that firestore.rules' owner-only
// `users/{uid}` rule doesn't allow anyway.
// `timesReported` (2026-09-12, lib/badges.js's GRUP_IBADAH_TIERS) — a
// lifetime counter of how many times this member has opened/reported
// into this group, `merge: true` + `increment(1)` so it survives every
// other field being overwritten on each report.
export async function reportMyGroupStats(groupId, user, userData) {
  await setDoc(doc(db, 'groups', groupId, 'memberStats', user.uid), {
    displayName: user.displayName || user.email || 'Sahabat airmoon',
    dzikirPagiStreak: userData?.dzikirStreak?.pagi?.current || 0,
    dzikirPetangStreak: userData?.dzikirStreak?.petang?.current || 0,
    readingStreak: userData?.readingStreak?.current || 0,
    timesReported: increment(1),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export function watchGroupMemberStats(groupId, callback) {
  return onSnapshot(collection(db, 'groups', groupId, 'memberStats'), (snap) => callback(snap.docs.map((d) => ({ uid: d.id, ...d.data() }))));
}

// Tantangan Mingguan (2026-09-12) — a single shared target the owner
// sets (e.g. "gabungan 20 hari streak minggu ini"), progress computed
// client-side from the same memberStats sum GroupDetail already shows,
// not a separate tracked counter — simplest thing that could work for
// an MVP challenge, no new subcollection needed.
export async function setGroupChallenge(groupId, target) {
  await updateDoc(doc(db, 'groups', groupId), { challenge: { target, createdAt: serverTimestamp() } });
}

export async function clearGroupChallenge(groupId) {
  await updateDoc(doc(db, 'groups', groupId), { challenge: null });
}
