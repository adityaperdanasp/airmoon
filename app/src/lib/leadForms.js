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
    referralMasjidCredited: false, // see check-campaign-deadlines.js's checkMasjidAdminReferrals
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

// Pendaftaran Relawan — see pages/Relawan.jsx. Same write-and-forget
// shape as the other lead forms: no volunteer-coordination system exists
// yet, so this just captures who's interested and how to reach them for
// the founder to follow up on manually.
export async function submitVolunteerLead(uid, data) {
  await addDoc(collection(db, 'volunteerLeads'), {
    uid,
    name: data.name || '',
    phone: data.phone,
    city: data.city || '',
    interest: data.interest || '',
    createdAt: serverTimestamp(),
  });
}

// Konsultasi Zakat Korporat — see pages/ZakatKorporat.jsx. B2B lead-gen:
// the estimate on that page is self-service, but real corporate zakat
// needs an actual conversation, so this just captures interest for the
// founder to follow up on directly (no automated consultant flow exists).
export async function submitCorporateZakatLead(uid, data) {
  await addDoc(collection(db, 'corporateZakatLeads'), {
    uid,
    companyName: data.companyName,
    contact: data.contact,
    estimatedZakat: Number(data.estimatedZakat) || 0,
    notes: data.notes || '',
    createdAt: serverTimestamp(),
  });
}
