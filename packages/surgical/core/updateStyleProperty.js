export default function updateStyleProperty(style, name, nextValue, lastValue) {
  if (nextValue !== lastValue) {
    if (nextValue != null) {
      style.setProperty(name, nextValue);
    } else if (lastValue != null) {
      style.removeProperty(name);
    }
  }
}
