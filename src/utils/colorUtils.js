export function darkenColor(hex, percent) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const num = parseInt(hex, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  r = Math.round(Math.max(0, Math.min(255, r - (r * percent) / 100)));
  g = Math.round(Math.max(0, Math.min(255, g - (g * percent) / 100)));
  b = Math.round(Math.max(0, Math.min(255, b - (b * percent) / 100)));

  // Pad each value to 2 digits and concatenate
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
}