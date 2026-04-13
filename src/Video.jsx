import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { TextOverlay } from './components/TextOverlay';
import { ScriptureScene } from './components/ScriptureScene';
import { ColorGrade } from './components/ColorGrade';
import { TitleCard } from './components/TitleCard';
import { ScrollScene } from './components/scenes/ScrollScene';
import { JerusalemScene } from './components/scenes/JerusalemScene';
import { SpainScene } from './components/scenes/SpainScene';
import { WestAfricaScene } from './components/scenes/WestAfricaScene';
import { MapsScene } from './components/scenes/MapsScene';
import { SlaveryScene } from './components/scenes/SlaveryScene';
import { DeuteronomyScene } from './components/scenes/DeuteronomyScene';
import { AmericasScene } from './components/scenes/AmericasScene';
import { SCENES } from './scenes';

// Map scene ID → cinematic background component
const SCENE_BACKGROUNDS = {
  'deuteronomy-warning': DeuteronomyScene,
  'jerusalem-70ad':      JerusalemScene,
  'spain-portugal':      SpainScene,
  'west-africa':         WestAfricaScene,
  'maps':                MapsScene,
  'slavery-prophecy':    SlaveryScene,
  'americas':            AmericasScene,
};

export const SephardicVideo = ({ platform = 'youtube' }) => {
  const { fps } = useVideoConfig();
  let offset = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SCENES.map((scene, i) => {
        const durationInFrames = scene.durationInSeconds * fps;
        const from = offset;
        offset += durationInFrames;

        const Background = SCENE_BACKGROUNDS[scene.id] || null;

        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
            <ColorGrade grade={scene.colorGrade}>

              {scene.audio && (
                <Audio src={staticFile(`audio/${scene.audio}`)} />
              )}

              {/* Opening scroll — animated parchment + scripture text */}
              {scene.type === 'scripture' && (
                <AbsoluteFill>
                  <ScrollScene />
                  <ScriptureScene
                    scripture={scene.scripture}
                    image={null}
                    platform={platform}
                  />
                </AbsoluteFill>
              )}

              {/* All scenes use cinematic animated backgrounds */}
              {scene.type === 'scene' && (
                <AbsoluteFill>
                  {Background && <Background />}
                  <TextOverlay lines={scene.lines} platform={platform} />
                </AbsoluteFill>
              )}

              {/* Final title card */}
              {scene.type === 'title' && (
                <TitleCard title={scene.title} subtitle={scene.subtitle} />
              )}

            </ColorGrade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
