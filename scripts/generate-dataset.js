import fs from 'fs';
import path from 'path';

// Helper to convert Katakana to Hiragana
function katakanaToHiragana(src) {
  return src.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

// Helper to clean reading (remove dots, dashes)
function cleanReading(reading) {
  let clean = reading.replace(/[\.\-]/g, '');
  return katakanaToHiragana(clean);
}

// Phonetic similarity score between two readings
function getSimilarityScore(r1, r2) {
  if (r1 === r2) return -1;
  let score = 0;
  
  // Length similarity
  if (r1.length === r2.length) {
    score += 4;
  } else if (Math.abs(r1.length - r2.length) === 1) {
    score += 2;
  }

  // First character match
  if (r1[0] === r2[0]) {
    score += 3;
  }

  // Last character match (very common for endings like ん, い, う, く, つ)
  if (r1[r1.length - 1] === r2[r2.length - 1]) {
    score += 3;
  }

  // Second character match (if exists)
  if (r1.length > 1 && r2.length > 1 && r1[1] === r2[1]) {
    score += 2;
  }

  // Check for shared vowels/rhymes (e.g. k-ei and s-ei)
  const isVowelMatch = (c1, c2) => {
    const vowels = {
      'あ': ['あ','か','さ','た','な','は','ま','や','ら','わ','が','ざ','だ','ば','ぱ','ぁ'],
      'い': ['い','き','し','ち','に','ひ','み','り','ぎ','じ','ぢ','び','ぴ','ぃ'],
      'う': ['う','く','す','つ','ぬ','ふ','む','ゆ','る','ぐ','ず','づ','ぶ','ぷ','ぅ','ゅ'],
      'え': ['え','け','せ','て','ね','へ','め','れ','げ','ぜ','で','べ','ぺ','ぇ'],
      'お': ['お','こ','そ','と','の','ほ','も','よ','ろ','ご','ぞ','ど','ぼ','ぽ','ぉ','ょ'],
      'ん': ['ん']
    };
    for (const [v, group] of Object.entries(vowels)) {
      if (group.includes(c1) && group.includes(c2)) return true;
    }
    return false;
  };

  if (isVowelMatch(r1[r1.length - 1], r2[r2.length - 1])) {
    score += 2;
  }

  return score;
}

async function main() {
  console.log('Fetching kanji data...');
  const url = 'https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json';
  
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    console.error('Failed to fetch from primary repo. Error:', error);
    process.exit(1);
  }

  const data = await response.json();
  const kanjiList = [];

  for (const [char, info] of Object.entries(data)) {
    // We prioritize new JLPT N3. If not specified, check jlpt_old.
    // Also include N4 if we need more entries.
    const jlpt = info.jlpt_new || info.jlpt_old || 99;
    
    // Skip if it doesn't have readings or meanings
    if (!info.meanings || info.meanings.length === 0) continue;
    
    const hasReadings = (info.readings_on && info.readings_on.length > 0) ||
                        (info.readings_kun && info.readings_kun.length > 0);
    if (!hasReadings) continue;

    kanjiList.push({
      kanji: char,
      jlpt: jlpt,
      meanings: info.meanings,
      readings_on: info.readings_on || [],
      readings_kun: info.readings_kun || []
    });
  }

  console.log(`Found ${kanjiList.length} total valid kanji.`);

  // Filter and sort. Prioritize N3 first, then N4 to fill up.
  const n3KanjiList = kanjiList.filter(k => k.jlpt === 3);
  const n4KanjiList = kanjiList.filter(k => k.jlpt === 4);
  const n2KanjiList = kanjiList.filter(k => k.jlpt === 2); // backup

  console.log(`N3 count: ${n3KanjiList.length}, N4 count: ${n4KanjiList.length}`);

  let selectedKanji = [...n3KanjiList];
  if (selectedKanji.length < 500) {
    // Fill remaining from N4
    const needed = 500 - selectedKanji.length;
    selectedKanji = selectedKanji.concat(n4KanjiList.slice(0, needed));
  }
  if (selectedKanji.length < 500) {
    // If still not enough, grab from N2
    const needed = 500 - selectedKanji.length;
    selectedKanji = selectedKanji.concat(n2KanjiList.slice(0, needed));
  }

  // Slice to exactly 500
  selectedKanji = selectedKanji.slice(0, 500);
  console.log(`Selected exactly ${selectedKanji.length} kanji for the dataset.`);

  // Process readings and meanings
  const processedList = selectedKanji.map((item, index) => {
    // Pick the most common reading (prefer On'yomi for N3 test style, or Kun'yomi if On'yomi is empty/less common)
    // Often, N3 tests test the standard On'yomi, but some common Kanji are Kun'yomi.
    // Let's pick the first available Onyomi. If not, pick Kunyomi.
    let rawReading = '';
    if (item.readings_on.length > 0) {
      rawReading = item.readings_on[0];
    } else {
      rawReading = item.readings_kun[0];
    }

    const reading = cleanReading(rawReading);
    
    // Pick a clean meaning (max 2-3 words)
    let meaning = item.meanings[0];
    // Clean up if meaning has parentheses or is too long
    meaning = meaning.split(',')[0].trim();

    return {
      kanji: item.kanji,
      reading: reading,
      meaning: meaning,
      // Temporarily store all readings for distractor matching
      allReadings: [...item.readings_on, ...item.readings_kun].map(r => cleanReading(r))
    };
  });

  // Collect all unique readings to search for distractors
  const allUniqueReadings = Array.from(new Set(processedList.map(item => item.reading)));

  // Generate distractors for each item
  const finalDataset = processedList.map((item, index) => {
    const correctReading = item.reading;

    // Score all unique readings
    const candidates = allUniqueReadings
      .map(cand => ({
        reading: cand,
        score: getSimilarityScore(correctReading, cand)
      }))
      .filter(cand => cand.score > 0)
      .sort((a, b) => b.score - a.score);

    // Pick top distractors
    let distractors = [];
    if (candidates.length >= 3) {
      // Pick 3 from the top 10 scoring ones to have believable options
      const pool = candidates.slice(0, Math.min(candidates.length, 12));
      // Shuffle pool and pick 3
      const shuffledPool = pool.sort(() => 0.5 - Math.random());
      distractors = shuffledPool.slice(0, 3).map(c => c.reading);
    }

    // Fallbacks if not enough phonetic distractors are found
    const defaultFallbacks = ['せい', 'こう', 'しょう', 'かん', 'しん', 'とう', 'たい', 'せん'];
    while (distractors.length < 3) {
      const fallback = defaultFallbacks[Math.floor(Math.random() * defaultFallbacks.length)];
      if (fallback !== correctReading && !distractors.includes(fallback)) {
        distractors.push(fallback);
      }
    }

    // Distribute into 10 tests (50 kanji per test, but wait, since user chose option 2:
    // "a completely randomized selection of 50 kanji from the 500 pool every time", 
    // we can still assign a default "test" attribute 1-10 to fulfill the schema of the file,
    // but the runtime code will pull random 50 from the whole pool! This is perfect.)
    const testNum = Math.floor(index / 50) + 1;

    return {
      kanji: item.kanji,
      reading: correctReading,
      meaning: item.meaning,
      test: testNum,
      distractors: distractors
    };
  });

  // Ensure directories exist
  const outputDir = path.resolve('src/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'kanji.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalDataset, null, 2), 'utf-8');
  console.log(`Successfully generated ${finalDataset.length} kanji dataset at ${outputPath}`);
}

main();
