export function suggestEmphasis(words, lengthCategory) {
  const maxEmph = lengthCategory === 'short' ? 2 : lengthCategory === 'medium' ? 3 : lengthCategory === 'long' ? 3 : 4;
  // score each content word by length
  const candidates = words
    .map((w, i) => ({ w, i, score: w.isConnector ? 0 : w.text.replace(/[^\w]/g,'').length }))
    .filter(c => c.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, maxEmph);
  const emphSet = new Set(candidates.map(c => c.i));
  return words.map((w, i) => ({ ...w, emphasized: emphSet.has(i) }));
}
