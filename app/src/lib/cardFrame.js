// The frame/border every airmoon share card draws — pulled out of ~15
// near-identical copy-pasted blocks so there's exactly one answer to
// "what does a card's border look like", not a slightly different alpha
// per file (0.55 here, 0.6 there) that nobody meant.
//
// THE RULE — pick one, never invent a third:
//   • drawStandardFrame  — a single thin gold hairline. The default for
//     every everyday card: an ayat, a quote, a zakat result, a tasbih
//     tally, a donation receipt, a history entry.
//   • drawMilestoneFrame — a double frame in a chosen accent colour.
//     Reserved for the rare "you reached something" cards (the Khatam
//     completion certificate, a new medal tier) so they read as visibly
//     more significant than a card you can generate any day.
//
// Both assume a 1080-wide canvas (the size every card uses) and take the
// canvas w/h so they also work for the taller 1080×2340 wallpaper render.

const GOLD_HAIRLINE = 'rgba(232, 184, 75, 0.55)';

export function drawStandardFrame(ctx, w, h) {
  ctx.strokeStyle = GOLD_HAIRLINE;
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, w - 72, h - 72);
}

export function drawMilestoneFrame(ctx, w, h, color = '#e8b84b') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, w - 80, h - 80);
  ctx.lineWidth = 2;
  ctx.strokeRect(56, 56, w - 112, h - 112);
}
