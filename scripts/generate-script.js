// Generates documentary narration script using Claude (Anthropic API)
// Run: node scripts/generate-script.js
// Will prompt for ANTHROPIC_API_KEY if not set in .env

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import readline from 'readline';

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

const SYSTEM_PROMPT =
  'You are a documentary scriptwriter specializing in historical narratives. ' +
  'Write powerful, concise narration for a documentary about the Sephardic Hebrew history \u2014 ' +
  'the journey of the children of Judah from Jerusalem through Spain, West Africa, and into the slave trade. ' +
  'Keep narration slow, authoritative, and emotionally resonant. ' +
  'Each line should work as standalone movie-trailer voiceover text.';

const SCENES = [
  {
    key: 'scene-01',
    title: 'Opening \u2014 The Prophecy',
    context: 'A parchment scroll with Hebrew script, warm candlelight, sacred atmosphere',
    maxWords: 20,
  },
  {
    key: 'scene-02',
    title: 'Jerusalem 70 AD',
    context: 'Jerusalem burning, Hebrew men in chains being led away by Roman soldiers',
    maxWords: 25,
  },
  {
    key: 'scene-03',
    title: 'Spain / Portugal \u2014 The Expulsion',
    context: 'Hebrew scholars expelled from Spain, families boarding wooden ships at the dock',
    maxWords: 30,
  },
  {
    key: 'scene-04',
    title: 'West Africa \u2014 The Kingdoms',
    context: 'A West African king on his throne, a thriving kingdom, Hebrew people among the nations',
    maxWords: 30,
  },
  {
    key: 'scene-05',
    title: 'The Ancient Maps',
    context: 'Old maps clearly labelled "Juda", "Kingdom of Judah", "Iudeorum Terra" in West Africa',
    maxWords: 25,
  },
  {
    key: 'scene-06',
    title: 'Slavery \u2014 The Prophecy Fulfilled',
    context: 'Iron yokes, slave ships, Deuteronomy 28 \u2014 Egypt again with ships, yokes of iron',
    maxWords: 35,
  },
];

async function generateNarration(client, scene) {
  const promptText =
    `Write a single narration line for this documentary scene.\n\n` +
    `Scene: ${scene.title}\n` +
    `Visual context: ${scene.context}\n` +
    `Maximum words: ${scene.maxWords}\n` +
    `Style: Slow, dramatic, movie trailer pacing \u2014 use "\u2026" for dramatic pauses.\n\n` +
    `Output ONLY the narration text, nothing else.`;

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: promptText }],
    });

    const block = response.content.find((b) => b.type === 'text');
    return block ? block.text.trim() : null;

  } catch (err) {
    if (err instanceof Anthropic.PermissionDeniedError) {
      console.error('\n  ERROR 403 \u2014 Permission denied. Possible causes:');
      console.error('    \u2022 Anthropic Console balance is $0 (the API is prepaid)');
      console.error('    \u2022 This model is not enabled for your account tier');
      console.error('    \u2022 Your IP/region is blocked by Anthropic');
      console.error('  Fix: https://console.anthropic.com/settings/billing');
    } else if (err instanceof Anthropic.NotFoundError) {
      console.error('\n  ERROR 404 \u2014 Model or endpoint not found.');
      console.error('  Current model: claude-opus-4-6');
      console.error('  Fix: https://docs.anthropic.com/en/docs/about-claude/models');
    } else if (err instanceof Anthropic.AuthenticationError) {
      console.error('\n  ERROR 401 \u2014 Invalid API key. Double-check the key you entered.');
    } else if (err instanceof Anthropic.RateLimitError) {
      console.error('\n  ERROR 429 \u2014 Rate limit hit. Wait a moment and try again.');
    } else {
      console.error(`\n  ERROR: ${err.message}`);
    }
    return null;
  }
}

async function main() {
  let apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.log('\nANTHROPIC_API_KEY not found in .env');
    apiKey = await prompt('Paste your Anthropic API key: ');
    if (!apiKey) {
      console.error('No key provided. Exiting.');
      process.exit(1);
    }
  }

  const client = new Anthropic({ apiKey });

  console.log('\n\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
  console.log('\u2551  RETURN OF JUDAH \u2014 Script Generator  \u2551');
  console.log('\u2551  Model: claude-opus-4-6               \u2551');
  console.log('\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d\n');

  const results = {};
  let successCount = 0;

  for (let i = 0; i < SCENES.length; i++) {
    const scene = SCENES[i];
    process.stdout.write(`[${i + 1}/${SCENES.length}] ${scene.title}\u2026 `);

    const narration = await generateNarration(client, scene);

    if (narration) {
      results[scene.key] = narration;
      console.log(`\n  \u2713  "${narration}"`);
      successCount++;
    } else {
      console.log('\n  \u2717  Failed \u2014 see error above');
    }

    if (i < SCENES.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (successCount === 0) {
    console.error('\n\u2717 No narrations generated. Fix the errors above and retry.');
    process.exit(1);
  }

  const outputPath = 'scripts/generated-narrations.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n\u2705 ${successCount}/${SCENES.length} narrations saved to ${outputPath}`);
  console.log('\nPaste these into the NARRATIONS array in scripts/generate-voiceover.js\n');
}

main();
