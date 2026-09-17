import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Fast CRC32 table & calculator
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf, offset = 0, length = buf.length) {
  let c = 0xffffffff;
  for (let i = offset; i < offset + length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const body = Buffer.concat([typeBuf, data]);
  const crc = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, body, crcBuf]);
}

function encodePNG(width, height, rgbaBuffer) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA color type
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Scanlines
  const rowStride = width * 4;
  const filtered = Buffer.alloc((1 + rowStride) * height);
  for (let y = 0; y < height; y++) {
    const dstOffset = y * (1 + rowStride);
    filtered[dstOffset] = 0;
    rgbaBuffer.copy(filtered, dstOffset + 1, y * rowStride, (y + 1) * rowStride);
  }

  const compressed = zlib.deflateSync(filtered, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Procedural renderer for ReceiptMind Icon
function renderReceiptMindIcon(size, variant = 'rounded') {
  // variant: 'square' | 'rounded' | 'maskable' | 'splash'
  const buf = Buffer.alloc(size * size * 4);

  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const idx = (y * size + x) * 4;
    const srcA = a / 255;
    const dstA = buf[idx + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA > 0) {
      buf[idx] = Math.round((r * srcA + buf[idx] * dstA * (1 - srcA)) / outA);
      buf[idx + 1] = Math.round((g * srcA + buf[idx + 1] * dstA * (1 - srcA)) / outA);
      buf[idx + 2] = Math.round((b * srcA + buf[idx + 2] * dstA * (1 - srcA)) / outA);
      buf[idx + 3] = Math.round(outA * 255);
    }
  }

  const scale = size / 512;
  const cx = size / 2;
  const cy = size / 2;

  // 1. Background geometry
  let cornerRadius = 0;
  if (variant === 'rounded') {
    cornerRadius = Math.round(115 * scale); // Standard iOS squircle radius
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let inBounds = true;
      if (cornerRadius > 0) {
        const dx = Math.max(0, Math.max(cornerRadius - x, x - (size - cornerRadius)));
        const dy = Math.max(0, Math.max(cornerRadius - y, y - (size - cornerRadius)));
        if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
          inBounds = false;
        }
      }
      if (inBounds) {
        // Deep ink-navy gradient: from #0f172a (15, 23, 42) to #090d16 (9, 13, 22)
        const t = (x + y) / (size * 2);
        const r = Math.round(15 * (1 - t) + 8 * t);
        const g = Math.round(23 * (1 - t) + 12 * t);
        const b = Math.round(42 * (1 - t) + 22 * t);
        setPixel(x, y, r, g, b, 255);

        // Golden rim stroke for rounded variant
        if (variant === 'rounded') {
          const borderDist = Math.min(x, Math.min(y, Math.min(size - 1 - x, size - 1 - y)));
          if (borderDist < 3.5 * scale) {
            setPixel(x, y, 245, 158, 11, 80);
          }
        }
      }
    }
  }

  // 2. Ambient Gold Glow
  const glowR = Math.round(160 * scale);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      if (dist < glowR) {
        const glowA = Math.round(35 * (1 - dist / glowR));
        setPixel(x, y, 245, 158, 11, glowA);
      }
    }
  }

  if (variant === 'splash') {
    // Minimalist Splash Emblem: Sleek Shield + Monogram R + Laser
    const emblemR = Math.round(140 * scale);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dist = Math.hypot(x - cx, y - cy);
        if (dist <= emblemR) {
          // Inner emblem dark slate
          const innerT = dist / emblemR;
          const er = Math.round(30 * (1 - innerT) + 15 * innerT);
          const eg = Math.round(41 * (1 - innerT) + 23 * innerT);
          const eb = Math.round(59 * (1 - innerT) + 42 * innerT);
          setPixel(x, y, er, eg, eb, 255);

          // Golden circle border
          if (dist >= emblemR - Math.round(4 * scale)) {
            setPixel(x, y, 245, 158, 11, 230);
          }
        }
      }
    }

    // Receipt silhouette inside splash emblem
    const rw = Math.round(120 * scale);
    const rh = Math.round(160 * scale);
    const rx = Math.round(cx - rw / 2);
    const ry = Math.round(cy - rh / 2);

    for (let y = ry; y < ry + rh; y++) {
      for (let x = rx; x < rx + rw; x++) {
        // Bottom zigzag
        if (y > ry + rh - Math.round(12 * scale)) {
          const seg = (x - rx) / (rw / 5);
          const frac = seg - Math.floor(seg);
          const zig = Math.abs(frac - 0.5) * 2;
          if (y > ry + rh - Math.round(zig * 10 * scale)) {
            continue;
          }
        }
        setPixel(x, y, 255, 255, 255, 250);
      }
    }

    // Scanner beam
    const beamY = Math.round(cy);
    for (let y = beamY - Math.round(4 * scale); y <= beamY + Math.round(4 * scale); y++) {
      for (let x = Math.round(cx - emblemR * 0.85); x <= Math.round(cx + emblemR * 0.85); x++) {
        setPixel(x, y, 245, 158, 11, 240);
      }
    }

    return encodePNG(size, size, buf);
  }

  // 3. Receipt Paper Geometry
  const isMask = variant === 'maskable';
  const rw = Math.round(240 * scale * (isMask ? 0.78 : 1));
  const rh = Math.round(300 * scale * (isMask ? 0.78 : 1));
  const rx = Math.round(cx - rw / 2);
  const ry = Math.round(cy - rh / 2);

  // Receipt shadow
  for (let y = ry + 8; y < ry + rh + 8; y++) {
    for (let x = rx + 6; x < rx + rw + 6; x++) {
      setPixel(x, y, 2, 6, 23, 110);
    }
  }

  // Receipt Body (Clean White/Off-white)
  for (let y = ry; y < ry + rh; y++) {
    for (let x = rx; x < rx + rw; x++) {
      // Bottom zigzag cut
      if (y > ry + rh - Math.round(18 * scale)) {
        const seg = (x - rx) / (rw / 6);
        const frac = seg - Math.floor(seg);
        const zig = Math.abs(frac - 0.5) * 2;
        if (y > ry + rh - Math.round(zig * 16 * scale)) {
          continue;
        }
      }
      const grad = (y - ry) / rh;
      const col = Math.round(255 - grad * 14);
      setPixel(x, y, col, col, col + 2, 255);
    }
  }

  // Header Store Bar & Amber Badge
  const pad = Math.round(24 * scale * (isMask ? 0.78 : 1));
  for (let y = ry + pad; y < ry + pad + Math.round(14 * scale); y++) {
    for (let x = rx + pad; x < rx + pad + Math.round(70 * scale); x++) {
      setPixel(x, y, 15, 23, 42, 255);
    }
    for (let x = rx + rw - pad - Math.round(40 * scale); x < rx + rw - pad; x++) {
      setPixel(x, y, 245, 158, 11, 255); // Amber pill
    }
  }

  // Dashed divider
  const divY1 = ry + pad + Math.round(30 * scale);
  for (let x = rx + pad; x < rx + rw - pad; x++) {
    if (Math.floor(x / (6 * scale)) % 2 === 0) {
      for (let dy = 0; dy < Math.max(1, Math.round(2 * scale)); dy++) {
        setPixel(x, divY1 + dy, 203, 213, 225, 255);
      }
    }
  }

  // Item lines
  const lineGap = Math.round(24 * scale * (isMask ? 0.78 : 1));
  for (let i = 0; i < 3; i++) {
    const ly = divY1 + Math.round(18 * scale) + i * lineGap;
    const lw = Math.round((110 - i * 15) * scale);
    for (let y = ly; y < ly + Math.round(9 * scale); y++) {
      for (let x = rx + pad; x < rx + pad + lw; x++) {
        setPixel(x, y, 100, 116, 139, 255);
      }
      for (let x = rx + rw - pad - Math.round(44 * scale); x < rx + rw - pad; x++) {
        setPixel(x, y, 51, 65, 85, 255);
      }
    }
  }

  // Total summary bar
  const totalY = divY1 + Math.round(102 * scale);
  for (let y = totalY; y < totalY + Math.round(20 * scale); y++) {
    for (let x = rx + pad; x < rx + pad + Math.round(60 * scale); x++) {
      setPixel(x, y, 15, 23, 42, 255);
    }
    for (let x = rx + rw - pad - Math.round(70 * scale); x < rx + rw - pad; x++) {
      setPixel(x, y, 217, 119, 6, 255); // Amber total
    }
  }

  // Glowing laser scanner beam
  const beamY = ry + Math.round(rh * 0.46);
  const beamH = Math.max(2, Math.round(5 * scale));
  for (let y = beamY - beamH; y <= beamY + beamH; y++) {
    const distY = Math.abs(y - beamY) / beamH;
    const beamAlpha = Math.round(230 * (1 - distY));
    for (let x = rx - Math.round(24 * scale); x < rx + rw + Math.round(24 * scale); x++) {
      setPixel(x, y, 251, 191, 36, beamAlpha);
    }
  }

  // Gold Shield Star Badge
  const badgeR = Math.round(36 * scale * (isMask ? 0.8 : 1));
  const bx = isMask ? Math.round(size * 0.72) : Math.round(size * 0.78);
  const by = isMask ? Math.round(size * 0.72) : Math.round(size * 0.78);
  for (let y = by - badgeR; y <= by + badgeR; y++) {
    for (let x = bx - badgeR; x <= bx + badgeR; x++) {
      const dist = Math.hypot(x - bx, y - by);
      if (dist <= badgeR) {
        if (dist >= badgeR - Math.round(4 * scale)) {
          setPixel(x, y, 245, 158, 11, 255);
        } else {
          setPixel(x, y, 15, 23, 42, 255);
        }
      }
    }
  }
  const starR = Math.round(badgeR * 0.55);
  for (let y = by - starR; y <= by + starR; y++) {
    for (let x = bx - starR; x <= bx + starR; x++) {
      const dx = Math.abs(x - bx);
      const dy = Math.abs(y - by);
      if (dx + dy <= starR * 1.3) {
        setPixel(x, y, 245, 158, 11, 255);
      }
    }
  }

  return encodePNG(size, size, buf);
}

// Generate SVG files
function createSquareIconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0" />
      <stop offset="30%" stop-color="#fbbf24" stop-opacity="1" />
      <stop offset="70%" stop-color="#f59e0b" stop-opacity="1" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#020617" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Canvas Background (Square) -->
  <rect width="512" height="512" fill="url(#bg)" />
  <circle cx="256" cy="256" r="220" fill="url(#glow)" />

  <!-- Receipt Paper -->
  <g filter="url(#shadow)">
    <path d="M 136 106 L 376 106 L 376 390 L 356 406 L 336 390 L 316 406 L 296 390 L 276 406 L 256 390 L 236 406 L 216 390 L 196 406 L 176 390 L 156 406 L 136 390 Z" fill="#ffffff" />
    <path d="M 136 106 L 376 106 L 376 390 L 356 406 L 336 390 L 316 406 L 296 390 L 276 406 L 256 390 L 236 406 L 216 390 L 196 406 L 176 390 L 156 406 L 136 390 Z" fill="none" stroke="#f1f5f9" stroke-width="2" />
  </g>

  <!-- Store Header Bar -->
  <rect x="164" y="136" width="90" height="14" rx="4" fill="#0f172a" />
  <rect x="312" y="136" width="36" height="14" rx="7" fill="#f59e0b" />

  <!-- Dashed Line -->
  <line x1="164" y1="172" x2="348" y2="172" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6,4" />

  <!-- Item Lines -->
  <rect x="164" y="196" width="110" height="10" rx="3" fill="#94a3b8" />
  <rect x="306" y="196" width="42" height="10" rx="3" fill="#334155" />

  <rect x="164" y="222" width="130" height="10" rx="3" fill="#94a3b8" />
  <rect x="312" y="222" width="36" height="10" rx="3" fill="#334155" />

  <rect x="164" y="248" width="95" height="10" rx="3" fill="#94a3b8" />
  <rect x="302" y="248" width="46" height="10" rx="3" fill="#334155" />

  <!-- Total Summary -->
  <rect x="164" y="286" width="70" height="18" rx="4" fill="#0f172a" />
  <rect x="278" y="286" width="70" height="18" rx="6" fill="#d97706" />

  <!-- Laser Scanner Beam -->
  <rect x="108" y="238" width="296" height="6" rx="3" fill="url(#beam)" />

  <!-- Star Security Shield Badge -->
  <g transform="translate(380, 380)">
    <circle cx="0" cy="0" r="44" fill="#0f172a" stroke="#f59e0b" stroke-width="4" />
    <!-- Star -->
    <path d="M 0 -22 L 6 -6 L 22 -6 L 10 4 L 14 20 L 0 10 L -14 20 L -10 4 L -22 -6 L -6 -6 Z" fill="#f59e0b" />
  </g>
</svg>`;
}

function createRoundedIconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg_r" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <radialGradient id="glow_r" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="beam_r" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0" />
      <stop offset="30%" stop-color="#fbbf24" stop-opacity="1" />
      <stop offset="70%" stop-color="#f59e0b" stop-opacity="1" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </linearGradient>
    <filter id="shadow_r" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#020617" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- iOS Squircle Rounded Canvas -->
  <rect width="512" height="512" rx="115" ry="115" fill="url(#bg_r)" stroke="#f59e0b" stroke-opacity="0.3" stroke-width="3" />
  <circle cx="256" cy="256" r="220" fill="url(#glow_r)" />

  <!-- Receipt Paper -->
  <g filter="url(#shadow_r)">
    <path d="M 136 106 L 376 106 L 376 390 L 356 406 L 336 390 L 316 406 L 296 390 L 276 406 L 256 390 L 236 406 L 216 390 L 196 406 L 176 390 L 156 406 L 136 390 Z" fill="#ffffff" />
    <path d="M 136 106 L 376 106 L 376 390 L 356 406 L 336 390 L 316 406 L 296 390 L 276 406 L 256 390 L 236 406 L 216 390 L 196 406 L 176 390 L 156 406 L 136 390 Z" fill="none" stroke="#f1f5f9" stroke-width="2" />
  </g>

  <!-- Store Header Bar -->
  <rect x="164" y="136" width="90" height="14" rx="4" fill="#0f172a" />
  <rect x="312" y="136" width="36" height="14" rx="7" fill="#f59e0b" />

  <!-- Dashed Line -->
  <line x1="164" y1="172" x2="348" y2="172" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6,4" />

  <!-- Item Lines -->
  <rect x="164" y="196" width="110" height="10" rx="3" fill="#94a3b8" />
  <rect x="306" y="196" width="42" height="10" rx="3" fill="#334155" />

  <rect x="164" y="222" width="130" height="10" rx="3" fill="#94a3b8" />
  <rect x="312" y="222" width="36" height="10" rx="3" fill="#334155" />

  <rect x="164" y="248" width="95" height="10" rx="3" fill="#94a3b8" />
  <rect x="302" y="248" width="46" height="10" rx="3" fill="#334155" />

  <!-- Total Summary -->
  <rect x="164" y="286" width="70" height="18" rx="4" fill="#0f172a" />
  <rect x="278" y="286" width="70" height="18" rx="6" fill="#d97706" />

  <!-- Laser Scanner Beam -->
  <rect x="108" y="238" width="296" height="6" rx="3" fill="url(#beam_r)" />

  <!-- Star Security Shield Badge -->
  <g transform="translate(372, 372)">
    <circle cx="0" cy="0" r="42" fill="#0f172a" stroke="#f59e0b" stroke-width="4" />
    <path d="M 0 -21 L 5 -5 L 21 -5 L 9 4 L 13 19 L 0 9 L -13 19 L -9 4 L -21 -5 L -5 -5 Z" fill="#f59e0b" />
  </g>
</svg>`;
}

function createSplashLogoSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="sp_glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="sp_beam" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0" />
      <stop offset="50%" stop-color="#fbbf24" stop-opacity="1" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Deep Slate Background -->
  <rect width="512" height="512" fill="#0a0f1d" />
  <circle cx="256" cy="256" r="230" fill="url(#sp_glow)" />

  <!-- Outer Ring Emblem -->
  <circle cx="256" cy="256" r="140" fill="#0f172a" stroke="#f59e0b" stroke-width="4" />
  <circle cx="256" cy="256" r="128" fill="none" stroke="#f59e0b" stroke-opacity="0.2" stroke-width="1.5" />

  <!-- Minimalist Clean Receipt Silhouette -->
  <g transform="translate(196, 176)">
    <path d="M 0 0 L 120 0 L 120 150 L 105 160 L 90 150 L 75 160 L 60 150 L 45 160 L 30 150 L 15 160 L 0 150 Z" fill="#ffffff" />
    <rect x="18" y="24" width="45" height="8" rx="2" fill="#0f172a" />
    <rect x="75" y="24" width="27" height="8" rx="4" fill="#f59e0b" />
    <line x1="18" y1="46" x2="102" y2="46" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,3" />
    <rect x="18" y="60" width="52" height="6" rx="2" fill="#94a3b8" />
    <rect x="78" y="60" width="24" height="6" rx="2" fill="#475569" />
    <rect x="18" y="76" width="60" height="6" rx="2" fill="#94a3b8" />
    <rect x="82" y="76" width="20" height="6" rx="2" fill="#475569" />
    <rect x="18" y="100" width="40" height="12" rx="3" fill="#0f172a" />
    <rect x="68" y="100" width="34" height="12" rx="4" fill="#d97706" />
  </g>

  <!-- Horizontal Scanning Laser Beam -->
  <rect x="136" y="253" width="240" height="6" rx="3" fill="url(#sp_beam)" />
</svg>`;
}

function createSplashScreenSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="spl_bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1d" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#070a12" />
    </linearGradient>
    <radialGradient id="spl_glow" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="spl_beam" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0" />
      <stop offset="50%" stop-color="#fbbf24" stop-opacity="1" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#spl_bg)" />
  <circle cx="540" cy="850" r="500" fill="url(#spl_glow)" />

  <!-- Central Logo Emblem -->
  <g transform="translate(540, 800)">
    <circle cx="0" cy="0" r="160" fill="#0f172a" stroke="#f59e0b" stroke-width="5" />
    <circle cx="0" cy="0" r="144" fill="none" stroke="#f59e0b" stroke-opacity="0.25" stroke-width="2" />

    <!-- Receipt Graphic -->
    <g transform="translate(-75, -95)">
      <path d="M 0 0 L 150 0 L 150 190 L 131 202 L 112 190 L 93 202 L 75 190 L 56 202 L 37 190 L 18 202 L 0 190 Z" fill="#ffffff" />
      <rect x="22" y="28" width="60" height="10" rx="3" fill="#0f172a" />
      <rect x="94" y="28" width="34" height="10" rx="5" fill="#f59e0b" />
      <line x1="22" y1="56" x2="128" y2="56" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="5,4" />
      <rect x="22" y="74" width="65" height="8" rx="2" fill="#94a3b8" />
      <rect x="98" y="74" width="30" height="8" rx="2" fill="#475569" />
      <rect x="22" y="96" width="75" height="8" rx="2" fill="#94a3b8" />
      <rect x="103" y="96" width="25" height="8" rx="2" fill="#475569" />
      <rect x="22" y="128" width="48" height="16" rx="4" fill="#0f172a" />
      <rect x="85" y="128" width="43" height="16" rx="5" fill="#d97706" />
    </g>

    <!-- Laser Beam -->
    <rect x="-170" y="-2" width="340" height="8" rx="4" fill="url(#spl_beam)" />
  </g>

  <!-- Typography Brand Header -->
  <text x="540" y="1060" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="800" font-size="44" fill="#ffffff" letter-spacing="1">ReceiptMind</text>
  <text x="540" y="1105" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="600" font-size="20" fill="#94a3b8" letter-spacing="3">AI SCANNER &amp; WARRANTY VAULT</text>

  <!-- Bottom Security Compliance Badge -->
  <g transform="translate(540, 1780)">
    <rect x="-180" y="-24" width="360" height="48" rx="24" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <circle cx="-135" cy="0" r="10" fill="#10b981" />
    <text x="-110" y="7" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#cbd5e1">Zero-Knowledge Encrypted</text>
  </g>
</svg>`;
}

// Ensure target directories exist
const publicDir = path.resolve('public');
const iconsDir = path.join(publicDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Generating Brand Asset Suite (Square, Rounded, Splash Logo, Splash Screen)...');

// 1. Generate SVGs
fs.writeFileSync(path.join(iconsDir, 'icon-square.svg'), createSquareIconSVG());
fs.writeFileSync(path.join(iconsDir, 'icon-rounded.svg'), createRoundedIconSVG());
fs.writeFileSync(path.join(iconsDir, 'splash-logo.svg'), createSplashLogoSVG());
fs.writeFileSync(path.join(iconsDir, 'splash-screen.svg'), createSplashScreenSVG());
fs.writeFileSync(path.join(publicDir, 'icon.svg'), createRoundedIconSVG());
fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), createSquareIconSVG());
console.log('✔ SVG vector assets created in public/icons/');

// 2. Generate PNGs (High Resolution)
const square512 = renderReceiptMindIcon(512, 'square');
fs.writeFileSync(path.join(iconsDir, 'icon-square.png'), square512);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), square512);

const rounded512 = renderReceiptMindIcon(512, 'rounded');
fs.writeFileSync(path.join(iconsDir, 'icon-rounded.png'), rounded512);

const splashLogo512 = renderReceiptMindIcon(512, 'splash');
fs.writeFileSync(path.join(iconsDir, 'splash-logo.png'), splashLogo512);

const maskable512 = renderReceiptMindIcon(512, 'maskable');
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), maskable512);

const p192 = renderReceiptMindIcon(192, 'square');
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), p192);

const appleTouch = renderReceiptMindIcon(180, 'rounded');
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);

const favicon = renderReceiptMindIcon(48, 'rounded');
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon);

console.log('✔ All high-resolution PNG variations generated successfully!');
