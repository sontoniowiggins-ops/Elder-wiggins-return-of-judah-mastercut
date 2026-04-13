// scripts/upload-to-drive.js
// Uploads out/return-of-judah.mp4 to Google Drive.
// Uses curl for HTTP calls (Node.js outbound HTTPS is blocked on this server).
// Run after render: node scripts/upload-to-drive.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const VIDEO_PATH = path.join(__dirname, '..', 'out', 'return-of-judah.mp4');

function curlPost(url, data) {
  const args = Object.entries(data).map(([k, v]) => `--data-urlencode "${k}=${v}"`).join(' ');
  const out = execSync(`curl -s -X POST "${url}" ${args}`, { encoding: 'utf8' });
  return JSON.parse(out);
}

function curlJson(method, url, token, body) {
  const bodyArg = body ? `-d '${JSON.stringify(body).replace(/'/g, "'\\''")}'` : '';
  const out = execSync(
    `curl -s -X ${method} "${url}" -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" ${bodyArg}`,
    { encoding: 'utf8' }
  );
  return JSON.parse(out);
}

async function uploadToDrive() {
  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const folderId     = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error('ERROR: Google Drive credentials missing from .env');
    console.error('Run: node scripts/drive-auth.js');
    process.exit(1);
  }

  if (!folderId) {
    console.error('ERROR: GOOGLE_DRIVE_FOLDER_ID not set in .env');
    process.exit(1);
  }

  if (!fs.existsSync(VIDEO_PATH)) {
    console.error('ERROR: Video not found. Render it first:');
    console.error('  npx remotion render src/index.jsx SephardicYouTube out/return-of-judah.mp4');
    process.exit(1);
  }

  const sizeMB = (fs.statSync(VIDEO_PATH).size / 1024 / 1024).toFixed(1);
  const datestamp = new Date().toISOString().slice(0, 10);
  const fileName = `return-of-judah-${datestamp}.mp4`;

  // Step 1: Refresh access token
  console.log('Connecting to Google Drive...');
  const tokenRes = curlPost('https://oauth2.googleapis.com/token', {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  if (!tokenRes.access_token) {
    console.error('ERROR: Could not get access token:', JSON.stringify(tokenRes));
    process.exit(1);
  }

  const token = tokenRes.access_token;

  // Step 2: Upload file using multipart upload
  console.log(`Uploading ${fileName} (${sizeMB} MB)...`);

  const meta = JSON.stringify({ name: fileName, mimeType: 'video/mp4', parents: [folderId] });
  const uploadOut = execSync(
    `curl -s -X POST "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink" ` +
    `-H "Authorization: Bearer ${token}" ` +
    `-F "metadata=${meta};type=application/json" ` +
    `-F "file=@${VIDEO_PATH};type=video/mp4"`,
    { encoding: 'utf8', maxBuffer: 1024 * 1024 }
  );

  const file = JSON.parse(uploadOut);

  if (!file.id) {
    console.error('Upload failed:', uploadOut);
    process.exit(1);
  }

  // Step 3: Make shareable
  curlJson('POST', `https://www.googleapis.com/drive/v3/files/${file.id}/permissions`,
    token, { role: 'reader', type: 'anyone' });

  console.log('');
  console.log('Upload complete!');
  console.log(`  File : ${fileName}`);
  console.log(`  Link : ${file.webViewLink}`);
  console.log('');
}

uploadToDrive().catch(err => {
  console.error('Upload failed:', err.message);
  process.exit(1);
});
