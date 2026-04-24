# Programmatic Video Editing with ChatGPT (3m22s Workflow)

This guide turns ChatGPT into a planning + code-generation assistant for editing a **3 minute 22 second** video. It focuses on reliable workflows for:

- scene cuts and joins,
- transition timing,
- audio/video sync,
- captioning and export.

## What ChatGPT can and cannot do

- ChatGPT **can** draft scripts, FFmpeg commands, EDLs, and automation workflows.
- ChatGPT **cannot** directly open and modify raw video files by itself; you still run commands in local tools (FFmpeg/MoviePy/Premiere/DaVinci/cloud editors).

## Recommended path for this project

For a single 3m22s source clip, use one of these:

1. **Code-first automation (best for repeatable edits):** FFmpeg or MoviePy.
2. **Transcript-first precision (best for dialogue cleanup):** transcription -> cut list -> EDL/timeline edits.
3. **Browser AI editor (best for speed/no-code):** upload, prompt-based edits, export.

If you expect to edit many videos with the same pattern, choose **code-first**.

---

## 1) Programmer workflow (automation-first)

### Tools
- ChatGPT for prompt-to-code.
- Python + MoviePy *or* direct FFmpeg commands.
- Local media files.

### Prompt template for ChatGPT

```text
Write a Python script that:
1) Loads input.mp4
2) Keeps only these ranges: 00:10-00:20 and 01:00-01:15
3) Joins them in order
4) Adds a 0.5s crossfade between clips
5) Normalizes audio to -16 LUFS target
6) Exports output.mp4 at 1080p, 30fps using H.264 + AAC
Return both MoviePy code and equivalent FFmpeg commands.
```

### Why this works
- You can version-control exact edits.
- You can rerun with new clips automatically.
- You avoid manual timeline drift when updating scenes.

---

## 2) Text-based editing (precision-first)

### Tools
- Transcript source (Whisper, Premiere transcript, etc.).
- ChatGPT to produce cut decisions.
- Premiere Pro or DaVinci Resolve for timeline conform.

### Workflow
1. Generate transcript with timestamps.
2. Ask ChatGPT to identify: filler words, long pauses, retakes.
3. Convert selected removals into an edit list (CSV/EDL-like ranges).
4. Apply on timeline and review jump cuts.
5. Add J-cuts/L-cuts and room tone where needed.

### Prompt template

```text
Using this timestamped transcript, create a cut list that removes:
- silences over 450 ms,
- filler phrases ("um", "uh", "you know") unless needed for meaning,
- repeated takes.
Output:
1) JSON array with start/end remove ranges,
2) human-readable rationale per cut,
3) final estimated runtime.
```

---

## 3) Browser AI editor (speed-first)

Use this when you want fast iteration and auto-captioning without local scripting.

### Suggested process
1. Upload source clip.
2. Apply an "auto remove silence" or "auto trim filler" pass.
3. Generate captions, then manually correct proper nouns/scripture names.
4. Add transition presets conservatively (avoid over-stylizing).
5. Export and do a final sync/audio QC pass.

---

## Quality checklist (applies to all methods)

- Loudness target near platform standard (e.g., around -16 LUFS stereo for web delivery).
- Dialogue never clipped; peaks generally below -1 dBTP.
- Captions aligned within ~100 ms for key spoken phrases.
- No abrupt music cuts at scene joins.
- Transition duration is consistent (typically 8-20 frames for subtle cuts).

---

## Decision matrix

| Priority | Best option |
|---|---|
| Repeatability / bulk edits | Programmer workflow |
| Surgical talking-head cleanup | Text-based workflow |
| Fastest non-technical workflow | Browser AI editor |

---

## Minimal command examples

### FFmpeg trim + concat + audio normalize (two-segment example)

```bash
ffmpeg -i input.mp4 \
  -filter_complex "\
[0:v]trim=start=10:end=20,setpts=PTS-STARTPTS[v0]; \
[0:a]atrim=start=10:end=20,asetpts=PTS-STARTPTS[a0]; \
[0:v]trim=start=60:end=75,setpts=PTS-STARTPTS[v1]; \
[0:a]atrim=start=60:end=75,asetpts=PTS-STARTPTS[a1]; \
[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]; \
[a]loudnorm=I=-16:TP=-1.5:LRA=11[aout]" \
  -map "[v]" -map "[aout]" \
  -c:v libx264 -preset medium -crf 18 -c:a aac -b:a 192k output.mp4
```

> Tip: for many cuts, generate segments from JSON and build commands programmatically.

