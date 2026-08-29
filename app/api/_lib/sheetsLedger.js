// Shared helper — appends one row per confirmed payment (real Midtrans
// payment or manual GoPay/Mandiri) to a Google Sheet the founder uses for
// monthly reports. Reuses the same Firebase Admin service account already
// set up for Firestore/FCM (FIREBASE_SERVICE_ACCOUNT_B64) rather than
// minting a separate Google credential — a Firebase project's service
// account is a real GCP service account, so it can call the Sheets API
// too once (a) the Sheet is shared with its email as Editor and (b) the
// Sheets API is enabled on the project, both one-time manual steps.
//
// Lives under api/_lib/ (not api/) specifically so Vercel doesn't treat
// this as its own route — same underscore-prefix convention already
// relied on this session for one-off temporary endpoints.

import { JWT } from 'google-auth-library';

const LEDGER_SPREADSHEET_ID = '1GtGIzOmOLDK2s5grQltNPqnlJs5mKBzUuNa0ZwRf0k0';
const LEDGER_GID = 2045202696;
const HEADER = ['Waktu', 'Nama', 'Metode', 'Jumlah', 'Campaign', 'Referensi'];

let cachedClient = null;
let cachedSheetTitle = null;

function getServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) throw new Error('FIREBASE_SERVICE_ACCOUNT_B64 belum diset.');
  return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
}

function getClient() {
  if (cachedClient) return cachedClient;
  const sa = getServiceAccount();
  cachedClient = new JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return cachedClient;
}

// The Sheets API's `values.append` range wants a tab NAME, not the `gid`
// from the URL — resolved once per warm function instance (cached in
// memory) rather than hardcoded, so renaming the tab later doesn't break
// this silently.
async function resolveSheetTitle(client) {
  if (cachedSheetTitle) return cachedSheetTitle;
  const res = await client.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${LEDGER_SPREADSHEET_ID}?fields=sheets.properties`,
  });
  const sheet = res.data.sheets.find((s) => s.properties.sheetId === LEDGER_GID);
  if (!sheet) throw new Error(`Tab dengan gid ${LEDGER_GID} tidak ditemukan di spreadsheet.`);
  cachedSheetTitle = sheet.properties.title;
  return cachedSheetTitle;
}

async function ensureHeader(client, title) {
  const res = await client.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${LEDGER_SPREADSHEET_ID}/values/${encodeURIComponent(title)}!A1:F1`,
  });
  if (res.data.values?.length) return; // header row already present
  await client.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${LEDGER_SPREADSHEET_ID}/values/${encodeURIComponent(title)}!A1:F1?valueInputOption=RAW`,
    method: 'PUT',
    data: { values: [HEADER] },
  });
}

// Best-effort — a Sheets hiccup should never fail the caller's actual
// payment-confirmation flow (the donation is already real/credited by the
// time this runs), so callers should call this in a try/catch and only
// log on failure, same convention as sendTelegramNotification elsewhere.
export async function appendLedgerRow({ name, method, amount, campaign, reference }) {
  const client = getClient();
  const title = await resolveSheetTitle(client);
  await ensureHeader(client, title);
  const row = [
    new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    name || '-',
    method,
    amount,
    campaign,
    reference,
  ];
  await client.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${LEDGER_SPREADSHEET_ID}/values/${encodeURIComponent(title)}!A:F:append?valueInputOption=USER_ENTERED`,
    method: 'POST',
    data: { values: [row] },
  });
}
