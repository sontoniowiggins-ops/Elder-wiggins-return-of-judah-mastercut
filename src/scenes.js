// ALL scene data lives here — edit text, timing, and narration in one place
// Total runtime: ~2 minutes

export const FPS = 30;

export const SCENES = [
  {
    id: 'scroll-prophecy',
    type: 'scripture',
    image: 'scene-01-scroll.png',
    audio: null,
    durationInSeconds: 20,
    colorGrade: 'warm',
    scripture: {
      lines: [
        'Before the ships…',
        'Before the chains…',
        'Before the world called them',
        'by another name…',
        'There was a prophecy.',
      ],
      reference: null,
    },
    narration: '',
  },
  {
    id: 'jerusalem-70ad',
    type: 'scene',
    image: 'scene-02-jerusalem.png',
    audio: null, // set to 'scene-02.mp3' once audio is generated
    durationInSeconds: 25,
    colorGrade: 'fire',
    lines: [
      'In 70 AD…',
      'Jerusalem fell.',
      'And the children of Judah were taken…',
      'into captivity.',
    ],
    // Exact voiceover timing (seconds from scene start)
    voiceTiming: [0, 5, 10, 15, 18],
    narration:
      'In seventy AD… Jerusalem fell. And the children of Judah were taken… into captivity.',
  },
  {
    id: 'spain-portugal',
    type: 'scene',
    image: 'scene-03-spain.png',
    audio: null, // set to 'scene-03.mp3' once audio is generated
    durationInSeconds: 20,
    colorGrade: 'warm-to-dark',
    lines: [
      'They were scattered…',
      'into Spain… and Portugal…',
      'where they lived…',
      'until they were driven out again.',
    ],
    narration:
      'They were scattered… into Spain… and Portugal… where they lived… until they were driven out again.',
  },
  {
    id: 'west-africa',
    type: 'scene',
    image: 'scene-04-westafrica.png',
    audio: null, // set to 'scene-04.mp3' once audio is generated
    durationInSeconds: 20,
    colorGrade: 'warm-gold',
    lines: [
      'They settled…',
      'in the lands beyond the rivers of Ethiopia…',
      'where kingdoms rose…',
      'and Judah lived among the nations.',
    ],
    narration:
      'They settled… in the lands beyond the rivers of Ethiopia… where kingdoms rose… and Judah lived among the nations.',
  },
  {
    id: 'maps',
    type: 'scene',
    image: 'scene-05-maps.png',
    audio: null, // set to 'scene-05.mp3' once audio is generated
    durationInSeconds: 20,
    colorGrade: 'sepia',
    lines: [
      'The maps recorded it…',
      'Not once…',
      'Not twice…',
      'But for over two hundred years…',
      'Judah…',
      'was there.',
    ],
    narration:
      'The maps recorded it… Not once… Not twice… But for over two hundred years… Judah… was there.',
  },
  {
    id: 'slavery-prophecy',
    type: 'scene',
    image: 'scene-06-slavery.png',
    audio: null, // set to 'scene-06.mp3' once audio is generated
    durationInSeconds: 15,
    colorGrade: 'cold',
    lines: [
      'And the Lord said…',
      'they would go into Egypt again…',
      'with ships…',
      'and yokes of iron…',
      'upon their neck.',
    ],
    narration:
      'And the Lord said… they would go into Egypt again… with ships… and yokes of iron… upon their neck.',
  },
  {
    id: 'title-card',
    type: 'title',
    image: null,
    audio: null,
    durationInSeconds: 5,
    colorGrade: 'black',
    title: 'THE RETURN OF JUDAH',
    subtitle: 'COMING SOON',
  },
];

export const TOTAL_DURATION_FRAMES = SCENES.reduce(
  (sum, s) => sum + s.durationInSeconds * FPS,
  0
);
