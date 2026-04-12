// Generates images one at a time using DALL-E 3 HD
// Run: node scripts/generate-images.js
// Requires OPENAI_API_KEY in .env
//
// IMAGES THIS SCRIPT WILL GENERATE:
//   scene-01-scroll.png     — Opening parchment scroll
//   scene-03-spain.png      — Spain/Portugal dock, Hebrew captives + Roman soldiers (REGENERATED)
//   scene-06-slavery.png    — Iron yokes, slave ship
//
// IMAGES ALREADY GENERATED (copy manually to public/images/):
//   scene-02-jerusalem.png  — Black Hebrews in chains, Jerusalem burning
//   scene-04-westafrica.png — West African king on throne, marketplace
//   scene-05-maps.png       — Ancient map: "Juda / Kingdom of Judah / Iudeorum Terra"

import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import https from 'https';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const OUTPUT_DIR = path.join('public', 'images');

// STYLE LOCK — applied to all prompts for consistency
// Match: deep brown African phenotype, ultra-realistic film still,
// cinematic lighting, no painting/cartoon/fantasy
const STYLE_LOCK =
  'ultra-realistic cinematic film still, 8k detail, photorealistic, ' +
  'no painting, no illustration, no cartoon, no fantasy, no AI smoothness, ' +
  'film grain, professional color grading, serious tone, documentary style';

const IMAGES = [
  {
    filename: 'scene-01-scroll.png',
    scene: 'Opening — Parchment Scroll',
    prompt:
      'Ancient worn parchment scroll laying on a dark wooden table, ' +
      'Hebrew-style script clearly visible, aged ink, frayed edges, realistic fiber texture, ' +
      'warm golden side lighting, deep shadows, dust particles floating in air, ' +
      'shallow depth of field, dramatic cinematic lighting, no glow effects, ' +
      'historically grounded, sacred atmosphere, extremely detailed, ' + STYLE_LOCK,
  },
  {
    filename: 'scene-03-spain.png',
    scene: 'Spain/Portugal — Hebrew Captives Arriving at Port',
    prompt:
      'Ultra-realistic cinematic historical scene, 8K. ' +
      'Massive ancient dock in Spain or Portugal, stone port city buildings in background, ' +
      'large wooden Roman-era transport ships unloading thousands of captives at harbor. ' +
      'FOREGROUND: Black Hebrew men with deep brown skin, African phenotype, ' +
      'faces sharp and clearly visible, strong features, textured natural hair, ' +
      'wearing worn torn linen garments, iron chains at neck and wrists, ' +
      'expressions exhausted but deeply dignified and proud. ' +
      'MIDGROUND: hundreds of captives descending ship gangplanks, massive crowd scale. ' +
      'RIGHT SIDE: wealthy Black noblemen in royal robes, gold embroidery, ' +
      'head coverings, handing coins to soldiers, redeeming captives. ' +
      'LEFT SIDE: Roman soldiers, clearly white European appearance, ' +
      'full Roman armor, red-plumed helmets, controlling captives with authority. ' +
      'LIGHTING: deep golden cinematic sunset lighting, dramatic long shadows, ' +
      'dust particles in air, warm amber and orange glow, epic scale. ' +
      'Style reference: rich sepia-gold color palette like an illuminated manuscript painting, ' +
      'painterly realism matching a cinematic historical epic, sharp detailed faces, ' +
      'NO soft focus, NO racial ambiguity, NO cartoon, NO blur, ' +
      'faces must be sharp expressive and detailed, ' +
      'emotional powerful epic historical tone, ' + STYLE_LOCK,
  },
  {
    filename: 'scene-07-deuteronomy.png',
    scene: 'Deuteronomy 28 — Moses Warning',
    prompt:
      'Ancient Black Hebrew prophet standing on a mountain, deep brown skin, African phenotype, ' +
      'long white robes, arms raised to the heavens, dramatic stormy sky behind him, ' +
      'lightning in background, large crowd of Black Israelites below listening, ' +
      'expressions of fear and solemnity, ancient stone tablets visible, ' +
      'warm golden light from above cutting through dark clouds, ' +
      'epic cinematic scale, documentary historical style, sharp detailed faces, ' +
      'emotional and powerful, ' + STYLE_LOCK,
  },
  {
    filename: 'scene-08-americas.png',
    scene: 'The Americas — Judah Arrives at New World Shore',
    prompt:
      'Large wooden European slave ships arriving at a tropical Caribbean coastline, ' +
      'palm trees, lush green hills, new world landscape, ' +
      'Black captives with deep brown skin, African phenotype, iron chains at neck and wrists, ' +
      'being forced off ships onto unfamiliar shores, ' +
      'expressions of exhaustion, grief, and quiet dignity, ' +
      'European colonizers in 16th century dress overseeing, ' +
      'dramatic overcast golden-gray sky, ocean mist, cinematic wide shot, ' +
      'hundreds of captives visible, overwhelming scale, ' +
      'cold blue-gray color grading, emotional and powerful, ' + STYLE_LOCK,
  },
  {
    filename: 'scene-06-slavery.png',
    scene: 'Slavery — Iron Yokes and Slave Ship',
    prompt:
      'Black enslaved men with deep brown skin, African phenotype, ' +
      'heavy iron yokes around their necks, thick chains on wrists and ankles, ' +
      'being loaded onto a large wooden slave ship at a West African coastal dock, ' +
      'ocean waves in background, overcast sky, harsh cold lighting, ' +
      'expressions of exhaustion, pain, and resistance, ' +
      'cold blue-gray color grading, slow motion feel, cinematic close-up on faces and iron, ' +
      'historically grounded, emotional realism, no exaggeration, ' + STYLE_LOCK,
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

async function generateImage(item, index) {
  const outputPath = path.join(OUTPUT_DIR, item.filename);

  if (fs.existsSync(outputPath)) {
    console.log(`  [skip] ${item.filename} already exists`);
    return;
  }

  console.log(`\n[${index + 1}/${IMAGES.length}] ${item.scene}`);
  console.log('  Sending to DALL-E 3 HD…');

  try {
    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: item.prompt,
      n: 1,
      size: '1792x1024',  // 16:9 — works for both YouTube and TikTok crop
      quality: 'hd',
      style: 'natural',   // natural = photorealistic
    });

    const imageUrl = response.data[0].url;
    console.log('  Downloading…');
    await downloadImage(imageUrl, outputPath);
    console.log(`  ✓ Saved → ${outputPath}`);

    if (index < IMAGES.length - 1) {
      console.log('  Waiting 4 seconds…');
      await new Promise((r) => setTimeout(r, 4000));
    }
  } catch (err) {
    console.error(`  ✗ ERROR: ${err.message}`);
    if (err.status === 400) {
      console.error('  DALL-E rejected this prompt. Try rephrasing.');
    }
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('\nERROR: OPENAI_API_KEY not set.');
    console.error('Run: cp .env.example .env  and add your key.\n');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('╔══════════════════════════════════════╗');
  console.log('║  RETURN OF JUDAH — Image Generator   ║');
  console.log('║  Generating 2 remaining images       ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('\nNOTE: Copy your 4 existing images into public/images/ first:');
  console.log('  scene-02-jerusalem.png');
  console.log('  scene-03-spain.png');
  console.log('  scene-04-westafrica.png');
  console.log('  scene-05-maps.png\n');

  for (let i = 0; i < IMAGES.length; i++) {
    await generateImage(IMAGES[i], i);
  }

  console.log('\n✅ Done! All images saved to:', OUTPUT_DIR);
  console.log('Next: npm run generate:voice  →  generate voiceover');
}

main();
