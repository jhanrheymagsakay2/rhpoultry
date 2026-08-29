// Levenshtein distance = how many single-letter edits (add/remove/change)
// it takes to turn one word into another. Small distance = close spelling,
// which is exactly the kind of "near miss" speech-to-text produces
// (e.g. "whoopy" transcribed as "whoopie").
function levenshteinDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i++) dp[i][0] = i
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[a.length][b.length]
}

// Soundex: a classic phonetic algorithm that reduces a word down to how
// it *sounds* (first letter + a code for its consonant sounds), ignoring
// vowels almost entirely. This is what catches things spelling-distance
// alone can't — e.g. "toei" and "toy" look quite different letter-by-letter,
// but both reduce to the same Soundex code because they sound alike.
const SOUNDEX_CODES = {
  b: '1', f: '1', p: '1', v: '1',
  c: '2', g: '2', j: '2', k: '2', q: '2', s: '2', x: '2', z: '2',
  d: '3', t: '3',
  l: '4',
  m: '5', n: '5',
  r: '6',
}

function soundex(word) {
  const letters = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!letters) return ''

  let code = letters[0].toUpperCase()
  let prevDigit = SOUNDEX_CODES[letters[0]] || ''

  for (let i = 1; i < letters.length && code.length < 4; i++) {
    const digit = SOUNDEX_CODES[letters[i]] || ''
    if (digit && digit !== prevDigit) code += digit
    prevDigit = digit
  }

  return (code + '000').slice(0, 4)
}

// Strips a trailing "s" so simple plurals match their singular form
// (e.g. "eggs" <-> "egg"). Deliberately simple/safe — avoids stripping
// short words where 's' is meaningful (e.g. "gas", "cats" -> "cat" is fine,
// but we skip words that are already very short).
function stem(word) {
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) {
    return word.slice(0, -1)
  }
  return word
}

// True if `query` appears in `text` exactly, OR closely enough
// (allowing for small spelling differences from speech-to-text).
// Handles multi-word queries by checking that every word in the query
// loosely matches some word in the text, not just the phrase as a whole.
export function fuzzyMatch(text, query) {
  text = text.toLowerCase()
  query = query.toLowerCase().trim()
  if (!query) return true
  if (text.includes(query)) return true

  // Ignore spacing entirely: catches cases where a product is one
  // compound word ("Topbreed") but gets spoken as two ("top breed"),
  // or the reverse.
  const noSpaceText = text.replace(/\s+/g, '')
  const noSpaceQuery = query.replace(/\s+/g, '')
  if (noSpaceQuery && noSpaceText.includes(noSpaceQuery)) return true

  const textWords = text.split(/\s+/)
  const queryWords = query.split(/\s+/)

  return queryWords.every((qWordRaw) => {
    const qWord = stem(qWordRaw)
    const qSoundex = qWord.length >= 3 ? soundex(qWord) : ''
    return textWords.some((tWordRaw) => {
      const tWord = stem(tWordRaw)
      if (tWordRaw.startsWith(qWordRaw) || tWord.startsWith(qWord)) return true
      if (qSoundex && tWord.length >= 3 && qSoundex === soundex(tWord)) return true
      const maxDistance = qWord.length <= 4 ? 1 : Math.floor(qWord.length / 4) + 1
      return levenshteinDistance(tWord, qWord) <= maxDistance
    })
  })
}
