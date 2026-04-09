import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';
import { IMAGES } from '../image-data.js';

// Opening scripture card — parchment image with verse text fading in
export const ScriptureScene = ({ scripture, image, platform = 'youtube' }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const isVertical = platform === 'tiktok';

  const bgOpacity = interpolate(frame, [0, 25, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const key = image ? image.replace(/\.(png|jpg|jpeg|webp)$/, '') : null;
  const imgSrc = key ? IMAGES[key] : null;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {/* Parchment scroll background */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        {imgSrc && (
          <img
            src={imgSrc}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} />
      </AbsoluteFill>

      {/* Scripture text */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 18,
          paddingLeft: 80,
          paddingRight: 80,
        }}
      >
        {scripture.lines.map((line, i) => {
          const startFrame = 20 + i * 18;
          const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                opacity,
                color: '#F5E6C8',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: isVertical ? 48 : 42,
                fontStyle: 'italic',
                fontWeight: '400',
                textAlign: 'center',
                textShadow: '1px 1px 8px rgba(0,0,0,0.9)',
                letterSpacing: '0.03em',
                lineHeight: 1.5,
              }}
            >
              {line}
            </div>
          );
        })}

        {/* Scripture reference */}
        {(() => {
          const refStart = 20 + scripture.lines.length * 18 + 10;
          const refOpacity = interpolate(frame, [refStart, refStart + 15], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              style={{
                opacity: refOpacity,
                color: '#D4A832',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: isVertical ? 34 : 28,
                fontWeight: '600',
                textAlign: 'center',
                marginTop: 20,
                letterSpacing: '0.1em',
                textShadow: '1px 1px 8px rgba(0,0,0,0.9)',
              }}
            >
              {scripture.reference}
            </div>
          );
        })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
