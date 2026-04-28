export function formatQuote(raw) {
  if (!raw) return '';
  return raw
    .trim()
    .replace(/"([^"]*)"/g, '\u201C$1\u201D')
    .replace(/'/g, '\u2019')
    .replace(/--/g, '\u2014')
    .replace(/\s+/g, ' ')
    .replace(/^([a-z])/, m => m.toUpperCase())
    .replace(/([^.!?\u201D])$/, '$1.');
}
