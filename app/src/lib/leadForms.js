import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Three small "submit a lead, founder follows up manually" forms
// (2026-09-12) that share the exact same shape — create-only from the
// client, own-submission read, no client update/delete (see
// firestore.rules' matching comments for why). Grouped in one file since
// none is complex enough to earn its own.

// Ajukan Campaign Masjid — an in-app alternative to the existing Google
// Form intake (still live — see CLAUDE.md), reviewed the same way: the
// founder sees new submissions in the daily digest folded into
// check-campaign-deadlines.js and manually replicates an approved one
// into the real approve-masjid.js pipeline. Deliberately not
// auto-published — this is a fundraising surface.
export async function submitCampaignRequest(uid, data) {
  await addDoc(collection(db, 'campaignRequests'), {
    uid,
    status: 'pending',
    namaMasjid: data.namaMasjid,
    lokasi: data.lokasi || '',
    plnCustomerId: data.plnCustomerId || '',
    waContact: data.waContact || '',
    targetAmount: Number(data.targetAmount) || 0,
    deskripsi: data.deskripsi || '',
    createdAt: serverTimestamp(),
  });
}

export function watchMyCampaignRequests(uid, callback) {
  if (!uid) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'campaignRequests'), where('uid', '==', uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

// Minat Umroh — a lead-gen form on the Umroh hub. No travel-agency
// partnership exists yet; this captures real demand so that conversation
// has actual numbers behind it instead of a guess.
export async function submitUmrohLead(uid, data) {
  await addDoc(collection(db, 'umrohLeads'), {
    uid,
    name: data.name || '',
    phone: data.phone,
    budgetRange: data.budgetRange || '',
    targetMonth: data.targetMonth || '',
    createdAt: serverTimestamp(),
  });
}

// "Hubungi Kami" — see pages/Bantuan.jsx. No support-ticketing system;
// the founder follows up directly using whatever contact the submitter
// left.
export async function submitSupportRequest(uid, data) {
  await addDoc(collection(db, 'supportRequests'), {
    uid,
    subject: data.subject || '',
    message: data.message,
    contact: data.contact || '',
    createdAt: serverTimestamp(),
  });
}
