// Generates ALL scene images using DALL-E 3 HD
// Run: node scripts/generate-images.js
// Requires OPENAI_API_KEY in .env
// Already-generated images are skipped automatically.

import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import https from 'https';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const OUTPUT_DIR = path.join('public', 'images');

const STYLE =
  'ultra-realistic cinematic film still, 8K detail, photorealistic, ' +
  'no painting, no illustration, no cartoon, film grain, ' +
  'professional color grading, documentary style, serious tone';

const IMAGES = [
  {
    filename: 'scene-01-scroll.png',
    scene: 'Opening — Ancient Parchment Scroll',
    prompt:
      'Ancient worn parchment scroll on a dark wooden table, Hebrew-style script visible, ' +
      'aged ink, frayed edges, realistic fiber texture, warm golden side lighting, ' +
      'deep shadows, dust particles in air, shallow depth of field, ' +
      'dramatic cinematic lighting, sacred atmosphere, extremely detailed, ' + STYLE,
  },
  {
    filename: 'scene-02-jerusalem.png',
    scene: 'Jerusalem 70 AD — City in Flames',
    prompt:
      'Ancient walled city of Jerusalem engulfed in fire and thick black smoke at night, ' +
      'massive stone temple walls crumbling, orange and red flames reflecting on stone, ' +
      'silhouettes of people fleeing through archways, Roman military banners visible, ' +
      'dramatic wide establishing shot, debris falling, enormous scale of destruction, ' +
      'dark and powerful atmosphere, cinematic historical epic, ' + STYLE,
  },
  {
    filename: 'scene-03-spain.png',
    scene: 'Spain — Ancient Harbor and Ships',
    prompt:
      'Vast medieval Mediterranean harbor in Spain at golden sunset, massive stone dock, ' +
      'large wooden sailing ships being loaded, hundreds of people on the docks, ' +
      'grand stone city buildings in the background, dramatic long shadows, ' +
      'warm amber and orange light, dust in the air, epic historical scale, ' +
      'cinematic wide shot, emotional atmosphere, ' + STYLE,
  },
  {
    filename: 'scene-04-westafrica.png',
    scene: 'West Africa — Ancient Kingdom',
    prompt:
      'Majestic ancient West African kingdom at golden hour, ' +
      'ornate carved stone palace architecture, bustling marketplace with traders, ' +
      'colorful fabrics, gold artifacts on display, tall baobab trees, ' +
      'people in traditional royal and merchant dress, ' +
      'prosperous and civilized atmosphere, warm golden sunset light, ' +
      'wide cinematic establishing shot, ' + STYLE,
  },
  {
    filename: 'scene-05-maps.png',
    scene: 'Ancient Maps — Judah in Africa',
    prompt:
      'Close-up of an authentic antique map from the 1500s on worn parchment, ' +
      'hand-drawn coastlines of West Africa, old Latin text labels, ' +
      'the word "IVDAH" or "JUDAH" clearly written on the African continent, ' +
      'compass rose, aged ink with visible cracking, warm side lighting, ' +
      'cartographic manuscript details, museum quality document photography, ' + STYLE,
  },
  {
    filename: 'scene-06-slavery.png',
    scene: 'The Prophecy — Iron and Ships',
    prompt:
      'Dramatic wide shot of a massive dark wooden sailing ship at a West African port at dusk, ' +
      'ominous stormy sky, rough ocean waves, dock workers and sailors visible as silhouettes, ' +
      'heavy iron chains and iron collar displayed as artifacts on worn dock wood in foreground, ' +
      'rust texture on iron, dramatic cold blue-gray lighting, ' +
      'powerful and sobering historical atmosphere, ' + STYLE,
  },
  {
    filename: 'scene-07-deuteronomy.png',
    scene: 'Deuteronomy 28 — Prophet on the Mountain',
    prompt:
      'Ancient dark-skinned prophet standing on a rocky mountain peak, long white robes, ' +
      'arms raised to the heavens, dramatic stormy sky with lightning in background, ' +
      'large crowd of people below at the mountain base, ' +
      'expressions of awe and fear, ancient stone tablets visible, ' +
      'warm golden light from above cutting through dark storm clouds, ' +
      'epic cinematic wide shot, powerful and emotional, ' + STYLE,
  },
  {
    filename: 'scene-08-americas.png',
    scene: 'The Americas — Ships Arriving at New World',
    prompt:
      'Three large 16th century wooden galleon sailing ships approaching a tropical Caribbean ' +
      'coastline at golden dusk, massive white sails billowing, dark hulls on turquoise water, ' +
      'tall palm trees lining the shore, dense green jungle hills, ' +
      'dramatic amber and gray sky with rays of light breaking through clouds, ' +
      'ocean mist, wide establishing cinematic shot, ominous and powerful atmosphere, ' + STYLE,
  },
];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('\nERROR: OPENAI_API_KEY not set. Add it to your .env file.\n');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const missing = IMAGES.filter(img => !fs.existsSync(path.join(OUTPUT_DIR, img.filename)));

  console.log('╔══════════════════════════════════════╗');
  console.log('║   RETURN OF JUDAH — Image Generator  ║');
  console.log(`║   ${missing.length} image(s) to generate              ║`);
  console.log('╚══════════════════════════════════════╝\n');

  if (missing.length === 0) {
    console.log('✅ All images already exist! Run npm start to preview.');
    return;
  }

  for (let i = 0; i < IMAGES.length; i++) {
    const item = IMAGES[i];
    const outputPath = path.join(OUTPUT_DIR, item.filename);

    if (fs.existsSync(outputPath)) {
      console.log(`  [skip] ${item.filename}`);
      continue;
    }

    console.log(`\n[${i + 1}/${IMAGES.length}] ${item.scene}`);
    console.log('  Sending to DALL-E 3 HD…');

    try {
      const response = await client.images.generate({
        model: 'dall-e-3',
        prompt: item.prompt,
        n: 1,
        size: '1792x1024',
        quality: 'hd',
        style: 'natural',
      });

      await downloadImage(response.data[0].url, outputPath);
      console.log(`  ✓ Saved → ${outputPath}`);

      if (i < IMAGES.length - 1) await new Promise(r => setTimeout(r, 4000));
    } catch (err) {
      console.error(`  ✗ FAILED: ${err.message}`);
    }
  }

  console.log('\n✅ Done! All images saved to public/images/');
  console.log('Next: npm start  →  preview your video\n');
}

main();
