function escapeRegex(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wordBoundaryRegex(term: string): RegExp {
  return new RegExp(`\\b${escapeRegex(term)}\\b`, 'i');
}

/** Positive signal match: exact phrase OR all individual words present in text */
export function positiveMatch(term: string, text: string): boolean {
  if (wordBoundaryRegex(term).test(text)) return true;

  const words = term.split(/\s+/);
  if (words.length > 1) {
    return words.every(word => wordBoundaryRegex(word).test(text));
  }
  return false;
}

/** Negative signal match: exact phrase only (prevents word-split false positives) */
export function negativeMatch(term: string, text: string): boolean {
  return wordBoundaryRegex(term).test(text);
}
