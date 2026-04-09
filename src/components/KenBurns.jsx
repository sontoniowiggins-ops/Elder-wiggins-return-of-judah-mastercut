import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

// Slow cinematic pan and zoom on a still image
// Shows dark placeholder if image file is missing — no crashes
export const KenBurns = ({ src, direction = 'right', startScale = 1.0, endScale = 1.12 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [startScale, endScale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const x = interpolate(
    frame,
    [0, durationInFrames],
    direction === 'right' ? [0, -2.5] : [-2.5, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const y = interpolate(frame, [0, durationInFrames], [0, -1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(
    frame,
    [0, 20, durationInFrames - 20, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity, backgroundColor: '#1a0f00' }}>
      {src && (
        <img
          src={`http://localhost:3001/images/${src}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale}) translate(${x}%, ${y}%)`,
            transformOrigin: 'center center',
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      {/* Dark vignette overlay */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
