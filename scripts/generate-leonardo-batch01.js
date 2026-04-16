// Return of Judah — Leonardo Image Batch 01
// Generates the first 2 cinematic Remotion images using LEONARDO_API_KEY.
//
// Outputs:
//   public/images/scene_01_ancient_kingdom_observer.png
//   public/images/scene_02_covenant_people.png
//   public/images/leonardo-batch01-manifest.json
//
// Rule: If an image is bad, regenerate and replace only the same filename.

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import https from 'https';

const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
const OUTPUT_DIR = path.join('public', 'images');
const API_BASE = 'https://cloud.leonardo.ai/api/rest/v1';

const STYLE_LOCK = [
  'ultra-realistic cinematic historical film still',
  'photorealistic documentary realism',
  '8K detail, natural human anatomy, realistic hands, realistic skin texture',
  'clearly Black people with deep brown to dark skin tones and natural African phenotype where people appear',
  'dramatic golden-hour lighting, atmospheric dust, film grain, professional color grading',
  'serious prophetic documentary tone',
  'no cartoon, no vector art, no illustration, no painting, no fantasy, no flat placeholder art, no screenshot, no phone UI, no code editor, no document page'
].join(', ');

const NEGATIVE_PROMPT = [
  'cartoon, illustration, painting, drawing, vector art, flat art, placeholder, screenshot, phone UI, app interface, code editor, document page, watermark, logo, blurry, distorted anatomy, extra fingers, missing fingers, broken hands, plastic skin, fantasy armor, European-only features, pale skin crowd, modern clothing, modern city, sci-fi, anime, text errors, misspelled text'
].join(', ');

const SCENES = [
  {
    number: 1,
    title: 'Ancient Kingdom Observer',
    filename: 'scene_01_ancient_kingdom_observer.png',
    textOnScreen: 'ANCIENT KINGDOM',
    sceneInfo: 'Opening visual: a clearly Black ancient observer overlooks a vast ancient city at sunset.',
    prompt: [
      'Scene 01 — Ancient Kingdom Observer.',
      'A clearly Black ancient man with deep brown skin and natural African phenotype stands on a rocky hill overlooking a vast ancient African-Mesopotamian mudbrick city at sunset.',
      'He wears earth-tone ancient robes, a cream headwrap, and a brown shawl, holding a wooden staff, back partly facing the camera, posture solemn and prophetic.',
      'Below him: crowded marketplace, livestock, traders, families, dust in the air, warm sunset light, massive ziggurat rising at the center of the city.',
      'Camera: wide cinematic establishing shot, 16:9, epic historical documentary frame.',
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
      'Scene 02 — The People of the Covenant.',
      'A clearly Black ancient covenant community stands outside a large mudbrick city gate at golden hour.',
      'Include Black elders, men, women, and children with deep brown to dark skin tones and natural African phenotype.',
      'They wear ancient linen robes, headwraps, earth-tone shawls, and leather sandals. Several elders hold scrolls. Families stand together with dignity, reverence, and solemn strength.',
      'Background: ancient mudbrick walls, distant marketplace life, warm sunset light, dust and atmospheric haze.',
      'Camera: cinematic medium-wide group composition, 16:9, real historical documentary film still.',
      STYLE_LOCK
    ].join(' '),
  },
];

function ensureKey() {
  if (!LEONARDO_API_KEY) {
    console.error('\nERROR: LEONARDO_API_KEY is not set.');
    console.error('Add it as a GitHub Actions repository secret or put it in .env locally.');
    process.exit(1);
  }
}

async function leonardoRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${LEONARDO_API_KEY}`,
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`Leonardo API ${response.status}: ${JSON.stringify(json)}`);
  }

  return json;
}

async function createGeneration(scene) {
  const body = {
    prompt: scene.prompt,
    negative_prompt: NEGATIVE_PROMPT,
    alchemy: false,
    modelId: '7b592283-e8a7-4c5a-9ba6-d18c31f258b9',
    contrast: 3.5,
    styleUUID: '111dc692-d470-4eec-b791-3475abac4c46',
    num_images: 1,
    width: 1920,
    height: 1080,
    ultra: false,
    public: false,
    guidance_scale: 7,
    num_inference_steps: 40,
  };

  const result = await leonardoRequest('/generations', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const generationId = result?.sdGenerationJob?.generationId;
  if (!generationId) {
    throw new Error(`No generationId returned: ${JSON.stringify(result)}`);
  }
  return generationId;
}

async function waitForGeneration(generationId) {
  const maxAttempts = 50;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await leonardoRequest(`/generations/${generationId}`, { method: 'GET' });
    const generation = result?.generations_by_pk;
    const status = generation?.status || 'UNKNOWN';
    const images = generation?.generated_images || [];

    console.log(`  Poll ${attempt}/${maxAttempts}: ${status} (${images.length} image)`);

    if (status === 'COMPLETE' && images.length > 0) {
      return images[0];
    }

    if (status === 'FAILED') {
      throw new Error(`Leonardo generation failed: ${JSON.stringify(result)}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 6000));
  }

  throw new Error(`Generation ${generationId} did not complete in time.`);
}

function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (error) => {
      fs.unlink(outputPath, () => {});
      reject(error);
    });
  });
}

async function generateScene(scene, index) {
  console.log('\n════════════════════════════════════════');
  console.log(`Scene ${String(scene.number).padStart(2, '0')} — ${scene.title}`);
  console.log(`Info: ${scene.sceneInfo}`);
  console.log(`Text on screen: ${scene.textOnScreen}`);
  console.log(`File: public/images/${scene.filename}`);

  const generationId = await createGeneration(scene);
  console.log(`  Generation ID: ${generationId}`);

  const image = await waitForGeneration(generationId);
  const outputPath = path.join(OUTPUT_DIR, scene.filename);

  console.log('  Downloading final image...');
  await downloadImage(image.url, outputPath);

  console.log(`  Saved: ${outputPath}`);

  return {
    number: scene.number,
    title: scene.title,
    sceneInfo: scene.sceneInfo,
    textOnScreen: scene.textOnScreen,
    filename: scene.filename,
    localPath: `public/images/${scene.filename}`,
    leonardoGenerationId: generationId,
    leonardoImageId: image.id,
    leonardoImageUrl: image.url,
  };
}

async function main() {
  ensureKey();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('RETURN OF JUDAH — LEONARDO BATCH 01');
  console.log('Generating 2 cinematic image assets.');
  console.log('Rule: replace bad images by same filename only.');

  const manifest = [];
  for (let i = 0; i < SCENES.length; i++) {
    const result = await generateScene(SCENES[i], i);
    manifest.push(result);
  }

  const manifestPath = path.join(OUTPUT_DIR, 'leonardo-batch01-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), scenes: manifest }, null, 2));

  console.log('\n✅ Leonardo Batch 01 complete.');
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((error) => {
  console.error('\n❌ Leonardo generation failed.');
  console.error(error.message);
  process.exit(1);
});
