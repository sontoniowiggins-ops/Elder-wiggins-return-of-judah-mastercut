// Return of Judah — OpenAI Image Batch 01
// Generates the first 2 cinematic Remotion images using OPENAI_API_KEY.
// Output folder: public/images/

import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join('public', 'images');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const STYLE_LOCK = [
  'ultra-realistic cinematic historical film still',
  'photorealistic documentary realism',
  '8K detail look, natural anatomy, realistic hands, realistic skin texture',
  'clearly Black ancient people with deep brown to dark skin tones where people appear',
  'dramatic golden-hour lighting, atmospheric dust, film grain, professional color grading',
  'serious prophetic documentary tone',
  'no cartoon, no vector art, no illustration, no painting, no fantasy, no flat placeholder art, no screenshot, no phone UI, no code editor, no document page'
].join(', ');

const SCENES = [
  {
    number: 1,
    title: 'Ancient Kingdom Observer',
    filename: 'scene_01_ancient_kingdom_observer.png',
    textOnScreen: 'ANCIENT KINGDOM',
    sceneInfo: 'Opening visual: a Black ancient observer overlooks a vast ancient city at sunset.',
    prompt: [
      'Create a realistic cinematic historical image for a documentary.',
      'Scene 01 — Ancient Kingdom Observer.',
      'A clearly Black ancient man with deep brown skin stands on a rocky hill overlooking a vast ancient mudbrick city at sunset.',
      'He wears earth-tone ancient robes, a cream headwrap, and a brown shawl, holding a wooden staff, back partly facing the camera, posture solemn and prophetic.',
      'Below him: crowded marketplace, livestock, traders, families, dust in the air, warm sunset light, massive ziggurat rising at the center of the city.',
      'Camera: wide cinematic establishing shot, 16:9, epic historical documentary frame.',
      'Add clean readable cinematic title text at the top: ANCIENT KINGDOM.',
      STYLE_LOCK
    ].join(' '),
  },
  {
    number: 2,
    title: 'The People of the Covenant',
    filename: 'scene_02_covenant_people.png',
    textOnScreen: 'THE PEOPLE OF THE COVENANT',
    sceneInfo: 'Community visual: Black elders, men, women, and children stand together as an ancient covenant people.',
    prompt: [
      'Create a realistic cinematic historical image for a documentary.',
      'Scene 02 — The People of the Covenant.',
      'A clearly Black ancient covenant community stands outside a large mudbrick city gate at golden hour.',
      'Include Black elders, men, women, and children with deep brown to dark skin tones.',
      'They wear ancient linen robes, headwraps, earth-tone shawls, and leather sandals. Several elders hold scrolls. Families stand together with dignity, reverence, and solemn strength.',
      'Background: ancient mudbrick walls, distant marketplace life, warm sunset light, dust and atmospheric haze.',
      'Camera: cinematic medium-wide group composition, 16:9, real historical documentary film still.',
      'Add clean readable cinematic title text at the top: THE PEOPLE OF THE COVENANT.',
      STYLE_LOCK
    ].join(' '),
  },
];

function ensureKey() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('\nERROR: OPENAI_API_KEY is not set.');
    console.error('Add it as a GitHub Actions repository secret or put it in .env locally.');
    process.exit(1);
  }
}

async function generateScene(scene) {
  console.log('\n════════════════════════════════════════');
  console.log(`Scene ${String(scene.number).padStart(2, '0')} — ${scene.title}`);
  console.log(`Info: ${scene.sceneInfo}`);
  console.log(`File: public/images/${scene.filename}`);

  const result = await client.images.generate({
    model: 'gpt-image-1',
    prompt: scene.prompt,
    n: 1,
    size: '1536x1024',
    quality: 'high',
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error(`No image returned for ${scene.title}`);

  const outputPath = path.join(OUTPUT_DIR, scene.filename);
  fs.writeFileSync(outputPath, Buffer.from(b64, 'base64'));
  console.log(`Saved: ${outputPath}`);

  return {
    number: scene.number,
    title: scene.title,
    sceneInfo: scene.sceneInfo,
    textOnScreen: scene.textOnScreen,
    filename: scene.filename,
    localPath: `public/images/${scene.filename}`,
    model: 'gpt-image-1',
    size: '1536x1024',
    quality: 'high'
  };
}

async function main() {
  ensureKey();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('RETURN OF JUDAH — OPENAI BATCH 01');
  console.log('Generating 2 cinematic image assets.');

  const manifest = [];
  for (const scene of SCENES) {
    manifest.push(await generateScene(scene));
  }

  const manifestPath = path.join(OUTPUT_DIR, 'openai-batch01-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), scenes: manifest }, null, 2));
  console.log('\nDone. Manifest:', manifestPath);
}

main().catch((error) => {
  console.error('\nOpenAI image generation failed.');
  console.error(error.message);
  process.exit(1);
});
