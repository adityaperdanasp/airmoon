// Shared Telegram-notify helper — extracted so new admin-alert endpoints
// (like check-campaign-deadlines.js) don't each hand-roll their own copy
// of what midtrans-notify.js/report-manual-payment.js already inlined.
export async function sendTelegramNotification(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('Telegram not configured (TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID missing) — skipping notify.');
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) console.error('Telegram send failed:', await res.text());
  } catch (err) {
    console.error('Telegram send error:', err);
  }
}
