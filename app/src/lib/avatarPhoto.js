// Turns a picked image file into a small square JPEG data URL — this
// project has no Firebase Storage bucket/upload handler anywhere (see
// profile.js's own note on why the avatar used to be color-only), and a
// compressed square this small comfortably fits inline on users/{uid}
// without needing one. Center-crops to a square first (an avatar circle
// clips to square anyway) rather than squashing a wide/tall photo.
const MAX_DIMENSION = 240; // an avatar only ever renders at a few dozen px on screen
const MAX_BYTES = 120_000; // generous headroom under Firestore's 1MB doc cap, shared with every other users/{uid} field

export function resizeImageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        const canvas = document.createElement('canvas');
        canvas.width = MAX_DIMENSION;
        canvas.height = MAX_DIMENSION;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, size, size, 0, 0, MAX_DIMENSION, MAX_DIMENSION);
        let quality = 0.82;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        // Re-encode at a lower quality rather than rejecting outright — a
        // busy real photo (not just a flat-color test image) can land
        // above the cap even at a small pixel size.
        while (dataUrl.length > MAX_BYTES && quality > 0.3) {
          quality -= 0.12;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal membaca gambar.'));
    };
    img.src = url;
  });
}
