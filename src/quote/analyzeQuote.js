import { STOPWORDS } from './stopwords.js';
import { formatQuote } from './formatQuote.js';

export function analyzeQuote(rawQuote, rawAuthor) {
  const cleaned = formatQuote(rawQuote);
  const author = (rawAuthor || '').trim();
  const len = cleaned.length;
  const lengthCategory = len < 40 ? 'short' : len < 100 ? 'medium' : len < 180 ? 'long' : 'very-long';

  const rawWords = cleaned.split(/(\s+)/).filter(w => w.length > 0);
  const words = [];
  rawWords.forEach((w) => {
    if (/^\s+$/.test(w)) return;
    const clean = w.replace(/[^\w\u2019']/g, '').toLowerCase();
    const isConnector = STOPWORDS.has(clean) || clean.length <= 2;
    words.push({ text: w, isConnector, emphasized: false, index: words.length });
  });

  // Tone
  const lower = cleaned.toLowerCase();
  let tone = 'neutral';
  if (/\b(lord|god|jesus|christ|faith|spirit|pray|heaven|holy|bible|scripture|gospel|savior)\b/.test(lower)) tone = 'scripture';
  else if (/\b(dream|hustle|grind|win|fight|rise|succeed|never|always|must|believe|conquer|unstoppable|legacy|champion)\b/.test(lower) || /[!?]/.test(cleaned)) tone = 'motivational';
  else if (/\b(think|remember|reflect|learn|understand|truly|perhaps|sometimes)\b/.test(lower)) tone = 'reflective';

  return { cleaned, author, length: len, lengthCategory, words, tone };
}
