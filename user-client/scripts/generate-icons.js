/**
 * Generate PNG icons from SVG for PWA compatibility.
 * Uses sharp (bundled with Next.js) to convert SVG → PNG.
 *
 * Usage: node scripts/generate-icons.js
 */

const sharp = require("sharp");
const path = require("path");

const ICONS_DIR = path.join(__dirname, "..", "public", "icons");

// SVG template matching the existing icon design
function createSvg(size) {
  const rx = size === 180 ? 0 : Math.round(size * 0.125);
  const borderInset = Math.round(size * 0.042);
  const borderRx = rx > 0 ? rx - 4 : 0;
  const strokeWidth = Math.max(2, Math.round(size / 128));
  const fontSize = Math.round(size * 0.29);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rx}" fill="#171717"/>
  <rect x="${borderInset}" y="${borderInset}" width="${size - borderInset * 2}" height="${size - borderInset * 2}" rx="${borderRx}" fill="none" stroke="#facc15" stroke-width="${strokeWidth}" opacity="0.3"/>
  <text x="${size / 2}" y="${size * 0.56}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="${fontSize}" fill="#facc15">A2Z</text>
</svg>`;
}

async function generate() {
  const icons = [
    { name: "icon-192x192.png", size: 192 },
    { name: "icon-512x512.png", size: 512 },
    { name: "apple-touch-icon.png", size: 180 },
  ];

  for (const { name, size } of icons) {
    const svg = Buffer.from(createSvg(size));
    const outPath = path.join(ICONS_DIR, name);

    await sharp(svg).resize(size, size).png().toFile(outPath);

    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  console.log("\nAll PWA icons generated successfully!");
}

generate().catch(console.error);
