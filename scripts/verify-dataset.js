import fs from 'fs';
import path from 'path';

function verify() {
  const dataPath = path.resolve('src/data/kanji.json');
  if (!fs.existsSync(dataPath)) {
    console.error('kanji.json does not exist!');
    process.exit(1);
  }

  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw);

  console.log(`Verifying dataset at ${dataPath}...`);
  console.log(`Total items: ${data.length}`);

  if (data.length !== 500) {
    console.error(`ERROR: Dataset does not contain exactly 500 items. Found ${data.length}.`);
    process.exit(1);
  }

  const kanjiSet = new Set();
  let errors = 0;

  data.forEach((item, idx) => {
    // Check fields
    if (!item.kanji || typeof item.kanji !== 'string') {
      console.error(`Error at index ${idx}: Missing or invalid "kanji"`);
      errors++;
    } else {
      kanjiSet.add(item.kanji);
    }

    if (!item.reading || typeof item.reading !== 'string') {
      console.error(`Error at index ${idx} (${item.kanji}): Missing or invalid "reading"`);
      errors++;
    }

    if (!item.meaning || typeof item.meaning !== 'string') {
      console.error(`Error at index ${idx} (${item.kanji}): Missing or invalid "meaning"`);
      errors++;
    }

    if (typeof item.test !== 'number' || item.test < 1 || item.test > 10) {
      console.error(`Error at index ${idx} (${item.kanji}): Invalid "test" number ${item.test}`);
      errors++;
    }

    if (!Array.isArray(item.distractors) || item.distractors.length !== 3) {
      console.error(`Error at index ${idx} (${item.kanji}): Must have exactly 3 distractors`);
      errors++;
    } else {
      item.distractors.forEach((dist, dIdx) => {
        if (!dist || typeof dist !== 'string') {
          console.error(`Error at index ${idx} (${item.kanji}) distractor ${dIdx}: Invalid distractor`);
          errors++;
        }
        if (dist === item.reading) {
          console.error(`Error at index ${idx} (${item.kanji}) distractor ${dIdx}: Distractor matches correct reading`);
          errors++;
        }
      });
    }
  });

  if (kanjiSet.size !== 500) {
    console.error(`ERROR: Found duplicate kanji. Unique kanji count: ${kanjiSet.size}`);
    errors++;
  }

  if (errors > 0) {
    console.error(`Verification FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('Verification PASSED! Dataset is healthy and clean.');
  }
}

verify();
