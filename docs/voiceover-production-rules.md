# Voiceover Production Rules

```yaml
voiceover_decision:
  use_voiceovers_created_by: "Elder Wiggins + ChatGPT"
  anthropic_api: "omit"
  narration_source: "Use the lines we created together in chat and production planning."
  tts_engine: "OpenAI TTS through scripts/generate-voiceover.js"
  voice: "onyx"
  speed: "0.80 or adjusted per scene to keep the beat"

core_rule:
  - "No dry moments."
  - "Keep the beat."
  - "Every scene must have voiceover, movement, text, music bed, and transition."
  - "Use the voiceover lines we created together unless Elder Wiggins approves a change."

scene_requirements:
  each_scene:
    - "image or cinematic visual"
    - "voiceover line"
    - "text on screen"
    - "motion: push-in, pan, drift, zoom, reveal, or parallax"
    - "music or sound bed"
    - "transition into next scene"

forbidden:
  - "silent still image"
  - "flat scene sitting too long"
  - "dead pause"
  - "dry academic narration"
  - "voiceover that loses the prophetic documentary beat"
```
