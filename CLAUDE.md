# Return of Judah — Video Project

## STANDARD RENDER WORKFLOW
Every time a video is ready, always do this automatically:

1. Render the video:
```
npx remotion render src/index.jsx SephardicYouTube out/return-of-judah.mp4 --log=error
```

2. Start the file server so Elder Wiggins can download it:
```
node -e "
const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer((req, res) => {
  const file = path.join('/home/user/ai-video/out', path.basename(req.url));
  if (fs.existsSync(file)) {
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename=return-of-judah.mp4');
    fs.createReadStream(file).pipe(res);
  } else { res.writeHead(404); res.end('Not found'); }
});
server.listen(8080, '0.0.0.0', () => console.log('Download ready'));
" &
```

3. Tell the user: Open browser and go to http://192.168.1.216:8080/return-of-judah.mp4

## PROJECT OWNER
Elder Sontonio Wiggins III — he is the director. Do all the work.

## SCENES (9 total, ~2:45 runtime)
All scenes use DALL-E photorealistic images via KenBurns component.
Images live in public/images/. Generate with: node scripts/generate-images.js

## UPCOMING WORK
- Episode 1: Full Jerusalem documentary (25 images)
- Voiceover narration for all scenes
- Auto-upload to Google Drive / YouTube after render
