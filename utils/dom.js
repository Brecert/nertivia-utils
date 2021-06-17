export function attr(el, name, value) {
  el.hasAttribute(name) && typeof value === "string"
    ? el.setAttribute(name, value)
    : Reflect.set(el, name, value);
}

export function h(tag, attrs, children) {
  const el = document.createElement(tag);

  Object.entries(attrs).forEach(([k, v]) => attr(el, k, v));

  el.append(...children);

  return el;
}
