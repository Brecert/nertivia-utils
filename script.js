import * as colorize from "./utils/colorize.js";

/** @type {typeof Document.prototype.querySelector} */
const $ = document.querySelector.bind(document);

// todo: rewrite all of this.

document
  .querySelectorAll(".rainbow")
  .forEach((el) => el.replaceWith(...colorize.html(el.textContent)));

const main = $("main");
const input = $("#input");

/** @type {HTMLTextAreaElement} */
const outputText = $("#outputText");
const outputPreview = $("#outputPreview");

/** @type {HTMLOutputElement} */
const rotateHueOutput = $("#rotate_hue_output");

/** @type {HTMLOutputElement} */
const hueScaleOutput = $("#hue_scale_output");

/** @type {Record<string, HTMLInputElement>} */
const inputs = {
  shortenOutput: $("#shorten_output"),
  outputHTML: $("#output_html"),
  rotateHue: $("#rotate_hue"),
  hueScale: $("#hue_scale"),
};

const nullish = (val, or) => (val != null ? val : or);
const nanish = (val, or) => (!isNaN(val) ? val : or);

const updatePreview = () => {
  const colorizeOptions = {
    compress: inputs.shortenOutput.checked,
    hue: nanish(parseInt(inputs.rotateHue.value, 10)),
    scale: nanish(parseFloat(inputs.hueScale.value)),
  };

  const html = colorize.html(input.value, colorizeOptions);

  outputText.value = inputs.outputHTML.checked
    ? html.map((v) => v.outerHTML).join("")
    : colorize.nertivia(input.value, colorizeOptions).join("");

  outputPreview.replaceChildren(...html);
};

input.addEventListener("input", updatePreview);

inputs.shortenOutput.addEventListener("input", updatePreview);
inputs.outputHTML.addEventListener("input", updatePreview);
inputs.rotateHue.addEventListener("input", (ev) => {
  updatePreview();
  rotateHueOutput.value = ev.currentTarget.value;
});
inputs.hueScale.addEventListener("input", (ev) => {
  updatePreview();
  hueScaleOutput.value = ev.currentTarget.value;
});

updatePreview();
