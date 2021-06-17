import { h } from "./dom.js";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function hsl2rgb(hue, sat, lit) {
  hue = hue % 360;
  sat = clamp(sat, 0, 1);
  lit = clamp(lit, 0, 1);

  let chroma = (1.0 - Math.abs(2.0 * lit - 1)) * sat * 255.0;
  let x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  let min = lit * 255 - chroma / 2;
  chroma += min;
  x += min;

  if (hue <= 60) {
    return [chroma, x, min];
  } else if (hue <= 120) {
    return [x, chroma, min];
  } else if (hue <= 180) {
    return [min, chroma, x];
  } else if (hue <= 240) {
    return [min, x, chroma];
  } else if (hue <= 300) {
    return [x, min, chroma];
  } else {
    return [chroma, min, x];
  }
}

const rgb2hex = (rgb, compress = false) => {
  const integer =
    ((Math.round(rgb[0]) & 0xff) << 16) +
    ((Math.round(rgb[1]) & 0xff) << 8) +
    (Math.round(rgb[2]) & 0xff);

  const string = integer.toString(16).toUpperCase();
  if (compress) {
    // reduce color accuracy crudely
    return string
      .padStart(6, "0")
      .split("")
      .filter((_, i) => i % 2)
      .join("");
  } else {
    return string.padStart(6, "0");
  }
};

function* generate({ hue = 0, scale = 1 } = {}) {
  for (let i = 0; true; i++) {
    yield hsl2rgb((i + hue) * 40 * scale, 1, 0.7);
  }
}

// todo: use Default_Ignorable_Code_Point once better supported
const isVisible = (char) => /\P{White_Space}/u.test(char);

export function map(fn, text, { hue = 0, scale = 1, compress = false } = {}) {
  const colors = generate({ hue, scale });

  return [...text].map((char) =>
    isVisible(char)
      ? fn(rgb2hex(colors.next().value, compress), char)
      : fn(null, char)
  );
}

export const hex = map.bind(null, (color, char) => [`#${color}`, char]);
export const nertivia = map.bind(null, (color, char) =>
  color != null ? `[#${color}]${char}` : char
);
export const html = map.bind(null, (color, char) =>
  h("span", { style: `color: #${color}` }, char)
);
