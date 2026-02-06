import { create } from 'zustand';
import { persist } from 'zustand/middleware';



export const GITHUB_THEME = {
  dark: [
    'var(--gh-level-0)',
    'var(--gh-level-1)',
    'var(--gh-level-2)',
    'var(--gh-level-3)',
    'var(--gh-level-4)'
  ],
  light: [
    'var(--gh-level-0)',
    'var(--gh-level-1)',
    'var(--gh-level-2)',
    'var(--gh-level-3)',
    'var(--gh-level-4)'
  ]
}

const GITHUB_PALETTE = {
  start: [
    { r: 14, g: 39, b: 102 }, // Level 0 (Dark Blue)
    { r: 33, g: 35, b: 152 }, // Level 1
    { r: 205, g: 219, b: 189 }, // Level 2
    { r: 181, g: 219, b: 110 }, // Level 3
    { r: 242, g: 255, b: 1 }    // Level 4 (Bright Yellow)
  ],
  mid: [
    { r: 10, g: 30, b: 80 },  // Level 0 (Deep Blue)
    { r: 40, g: 80, b: 160 }, // Level 1
    { r: 80, g: 160, b: 200 },// Level 2
    { r: 120, g: 200, b: 220 },// Level 3
    { r: 180, g: 240, b: 255 } // Level 4 (Cyan/White)
  ],
  end: [
    { r: 30, g: 10, b: 40 },  // Level 0
    { r: 100, g: 40, b: 100 },// Level 1
    { r: 180, g: 80, b: 140 },// Level 2
    { r: 220, g: 120, b: 160 },// Level 3
    { r: 255, g: 180, b: 200 } // Level 4
  ]
};

const BODYLINEAR_1 = {
  start: { r: 49, g: 49, b: 59 },
  mid: { r: 94, g: 133, b: 133 },
  end: { r: 150, g: 150, b: 150 },
};

const BODYLINEAR_2 = {
  start: { r: 27, g: 23, b: 35 },
  mid: { r: 145, g: 145, b: 200 },
  end: { r: 150, g: 150, b: 150 },
};


const CONTRAST = {
  start: { r: 209, g: 217, b: 255 },
  mid: { r: 193, g: 193, b: 100 },
  end: { r: 255, g: 255, b: 255 }, // Electric Lime
};

const BOXCOLORLINEAR_1 = {
  start: { r: 21, g: 18, b: 38 },
  mid: { r: 35, g: 0, b: 255 },
  end: { r: 199, g: 120, b: 150 }, // Emerald Glow
};

const BOXCOLORLINEAR_2 = {
  start: { r: 38, g: 42, b: 61 },
  mid: { r: 87, g: 97, b: 134 },
  end: { r: 178, g: 178, b: 150 }, // Dark Forest
}


const lerp = (start, end, t) => {
  return start + (end - start) * t;
};

const updateThemeVariable = (percentage) => {
  if (typeof document === 'undefined') return;

  let br, bg, bb;
  let bbr, bbg, bbb;


  let cr, cg, cb; // Contrast Color
  let r, g, b;       // linearColor1
  let lr, lg, lb;   //liniarColor2

  // GitHub Palette Colors (Array of 5 RGB objects)
  let ghColors = [];

  if (percentage <= 50) {
    const t = percentage / 50;


    // BodyLiniar1
    br = lerp(BODYLINEAR_1.start.r, BODYLINEAR_1.mid.r, t);
    bg = lerp(BODYLINEAR_1.start.g, BODYLINEAR_1.mid.g, t);
    bb = lerp(BODYLINEAR_1.start.b, BODYLINEAR_1.mid.b, t);

    // BodyLiniar2
    bbr = lerp(BODYLINEAR_2.start.r, BODYLINEAR_2.mid.r, t);
    bbg = lerp(BODYLINEAR_2.start.g, BODYLINEAR_2.mid.g, t);
    bbb = lerp(BODYLINEAR_2.start.b, BODYLINEAR_2.mid.b, t);

    // Contrast
    cr = lerp(CONTRAST.start.r, CONTRAST.mid.r, t);
    cg = lerp(CONTRAST.start.g, CONTRAST.mid.g, t);
    cb = lerp(CONTRAST.start.b, CONTRAST.mid.b, t);

    // linearColor1
    r = lerp(BOXCOLORLINEAR_1.start.r, BOXCOLORLINEAR_1.mid.r, t);
    g = lerp(BOXCOLORLINEAR_1.start.g, BOXCOLORLINEAR_1.mid.g, t);
    b = lerp(BOXCOLORLINEAR_1.start.b, BOXCOLORLINEAR_1.mid.b, t);

    //liniarColor2
    lr = lerp(BOXCOLORLINEAR_2.start.r, BOXCOLORLINEAR_2.mid.r, t);
    lg = lerp(BOXCOLORLINEAR_2.start.g, BOXCOLORLINEAR_2.mid.g, t);
    lb = lerp(BOXCOLORLINEAR_2.start.b, BOXCOLORLINEAR_2.mid.b, t);

    // GitHub Palette Interpolation (Start -> Mid)
    for (let i = 0; i < 5; i++) {
      ghColors[i] = {
        r: lerp(GITHUB_PALETTE.start[i].r, GITHUB_PALETTE.mid[i].r, t),
        g: lerp(GITHUB_PALETTE.start[i].g, GITHUB_PALETTE.mid[i].g, t),
        b: lerp(GITHUB_PALETTE.start[i].b, GITHUB_PALETTE.mid[i].b, t)
      };
    }

  } else {
    // RANGE 2: 50% to 100%
    const t = (percentage - 50) / 50;

    // Contrast
    cr = lerp(CONTRAST.mid.r, CONTRAST.end.r, t);
    cg = lerp(CONTRAST.mid.g, CONTRAST.end.g, t);
    cb = lerp(CONTRAST.mid.b, CONTRAST.end.b, t);

    // BodyLiniar1
    br = lerp(BODYLINEAR_1.mid.r, BODYLINEAR_1.end.r, t);
    bg = lerp(BODYLINEAR_1.mid.g, BODYLINEAR_1.end.g, t);
    bb = lerp(BODYLINEAR_1.mid.b, BODYLINEAR_1.end.b, t);

    // BodyLiniar2
    bbr = lerp(BODYLINEAR_2.mid.r, BODYLINEAR_2.end.r, t);
    bbg = lerp(BODYLINEAR_2.mid.g, BODYLINEAR_2.end.g, t);
    bbb = lerp(BODYLINEAR_2.mid.b, BODYLINEAR_2.end.b, t);

    // linearColor1
    r = lerp(BOXCOLORLINEAR_1.mid.r, BOXCOLORLINEAR_1.end.r, t);
    g = lerp(BOXCOLORLINEAR_1.mid.g, BOXCOLORLINEAR_1.end.g, t);
    b = lerp(BOXCOLORLINEAR_1.mid.b, BOXCOLORLINEAR_1.end.b, t);

    //liniarColor2
    lr = lerp(BOXCOLORLINEAR_2.mid.r, BOXCOLORLINEAR_2.end.r, t);
    lg = lerp(BOXCOLORLINEAR_2.mid.g, BOXCOLORLINEAR_2.end.g, t);
    lb = lerp(BOXCOLORLINEAR_2.mid.b, BOXCOLORLINEAR_2.end.b, t);

    // GitHub Palette Interpolation (Mid -> End)
    for (let i = 0; i < 5; i++) {
      ghColors[i] = {
        r: lerp(GITHUB_PALETTE.mid[i].r, GITHUB_PALETTE.end[i].r, t),
        g: lerp(GITHUB_PALETTE.mid[i].g, GITHUB_PALETTE.end[i].g, t),
        b: lerp(GITHUB_PALETTE.mid[i].b, GITHUB_PALETTE.end[i].b, t)
      };
    }
  }

  // Format strings

  const bodyLinearColorOne = `${Math.round(br)} ${Math.round(bg)} ${Math.round(bb)}`;
  const bodyLinearColorTwo = `${Math.round(bbr)} ${Math.round(bbg)} ${Math.round(bbb)}`;
  const linearColorOne = `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`;
  const contrastColor = `${Math.round(cr)} ${Math.round(cg)} ${Math.round(cb)}`;
  const linearColorTwo = `${Math.round(lr)} ${Math.round(lg)} ${Math.round(lb)}`;


  // Set ALL variables

  document.documentElement.style.setProperty('--body-Linear-1-rgb', bodyLinearColorOne);
  document.documentElement.style.setProperty('--body-Linear-2-rgb', bodyLinearColorTwo);
  document.documentElement.style.setProperty('--box-Linear-1-rgb', linearColorOne);
  document.documentElement.style.setProperty('--contrast-rgb', contrastColor);
  document.documentElement.style.setProperty('--box-Linear-2-rgb', linearColorTwo);

  // Set GitHub Theme Variables
  ghColors.forEach((color, index) => {
    document.documentElement.style.setProperty(`--gh-level-${index}`, `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`);
  });

  return ghColors.map(c => `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`);
};

export const useThemeStore = create(
  persist(
    (set) => ({
      sliderValue: 0,
      githubColors: [
        'rgb(14, 39, 102)',
        'rgb(33, 35, 152)',
        'rgb(205, 219, 189)',
        'rgb(181, 219, 110)',
        'rgb(242, 255, 1)'
      ],
      setTheme: (value) => {
        const colors = updateThemeVariable(value);
        set({ sliderValue: value, githubColors: colors });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const colors = updateThemeVariable(state.sliderValue);
          state.githubColors = colors;
        }
      },
    }
  )
);