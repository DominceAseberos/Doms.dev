import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const VISUALIZER_EFFECT = {
    start: { r: 85,   g: 252, b: 255 }, 
    mid:   { r: 183, g: 183, b: 183 },   
    end:   { r: 16, g: 68, b: 255 } 
}
const VISUALIZER_EFFECT_WOBBLE = {
    start:  { r: 16, g: 68, b: 255 } ,
    mid:   { r: 255, g: 255, b: 0 },   
    end:   { r: 85,   g: 252, b: 255 }, 
}

const BODYLINEAR_1 = {
  start: { r: 49, g: 49, b: 59 },  
  mid:   { r: 94, g: 133, b: 133 },   
  end:   { r: 245,   g: 170, b: 170 }, 
};

const BODYLINEAR_2 = {
  start: { r: 27,   g: 23, b: 35 },  
  mid:   { r: 145,   g: 145, b: 145 },   
  end:   { r: 215,   g: 150, b: 150 }, 
};


const CONTRAST = {
  start: { r: 209, g: 217, b: 255 },  
  mid:   { r: 193, g: 193, b: 100 },   
  end:   { r: 153,   g: 227, b: 237 }, 
};

const BOXCOLORLINEAR_1 = {
  start: { r: 21,  g: 18,  b: 38 }, 
  mid:   { r: 35,  g: 0,   b: 255 },  
  end:   { r: 255, g: 0,   b: 208 },  
};

const BOXCOLORLINEAR_2 = {
  start: { r: 38,  g: 42,  b: 61 }, 
  mid:   { r: 87,  g: 97,   b: 134 },  
  end:   { r: 255, g: 133,   b: 133 },  
}


const lerp = (start, end, t) => {
  return start + (end - start) * t;
};

const updateThemeVariable = (percentage) => {
  if (typeof document === 'undefined') return;

  let br,bg,bb;
  let bbr,bbg,bbb;
  let vr,vg,vb;
  let vvr,vvg,vvb;

  let cr, cg, cb; // Contrast Color
  let r, g, b;       // linearColor1
  let lr,lg,lb;   //liniarColor2
  if (percentage <= 50) {
    const t = percentage / 50; 
      // VisualizerEffect Wobble
    vvr = lerp(VISUALIZER_EFFECT_WOBBLE.start.r, VISUALIZER_EFFECT_WOBBLE.mid.r, t);
    vvg = lerp(VISUALIZER_EFFECT_WOBBLE.start.g, VISUALIZER_EFFECT_WOBBLE.mid.g, t);
    vvb = lerp(VISUALIZER_EFFECT_WOBBLE.start.b, VISUALIZER_EFFECT_WOBBLE.mid.b, t);

   // VisualizerEffect
    vr = lerp(VISUALIZER_EFFECT.start.r, VISUALIZER_EFFECT.mid.r, t);
    vg = lerp(VISUALIZER_EFFECT.start.g, VISUALIZER_EFFECT.mid.g, t);
    vb = lerp(VISUALIZER_EFFECT.start.b, VISUALIZER_EFFECT.mid.b, t);

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

  } else {
    // RANGE 2: 50% to 100%
    const t = (percentage - 50) / 50;


       // VisualizerEffect
    vvr = lerp(VISUALIZER_EFFECT_WOBBLE.mid.r, VISUALIZER_EFFECT_WOBBLE.end.r, t);
    vvg = lerp(VISUALIZER_EFFECT_WOBBLE.mid.g, VISUALIZER_EFFECT_WOBBLE.end.g, t);
    vvb = lerp(VISUALIZER_EFFECT_WOBBLE.mid.b, VISUALIZER_EFFECT_WOBBLE.end.b, t);

    // VisualizerEffect
    vr = lerp(VISUALIZER_EFFECT.mid.r, VISUALIZER_EFFECT.end.r, t);
    vg = lerp(VISUALIZER_EFFECT.mid.g, VISUALIZER_EFFECT.end.g, t);
    vb = lerp(VISUALIZER_EFFECT.mid.b, VISUALIZER_EFFECT.end.b, t);

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
  }

  // Format strings
  const visualizerEffectWobble = `${Math.round(vvr)} ${Math.round(vvg)} ${Math.round(vvb)}`;
  const visualizerEffect = `${Math.round(vr)} ${Math.round(vg)} ${Math.round(vb)}`;
  const bodyLinearColorOne = `${Math.round(br)} ${Math.round(bg)} ${Math.round(bb)}`;
  const bodyLinearColorTwo = `${Math.round(bbr)} ${Math.round(bbg)} ${Math.round(bbb)}`;
  const linearColorOne = `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`;
  const contrastColor = `${Math.round(cr)} ${Math.round(cg)} ${Math.round(cb)}`;
  const linearColorTwo = `${Math.round(lr)} ${Math.round(lg)} ${Math.round(lb)}`;


  // Set BOTH variables
    document.documentElement.style.setProperty('--visualizer-effect-wobble-rgb', visualizerEffectWobble);
  document.documentElement.style.setProperty('--visualizer-effect-rgb', visualizerEffect);
  document.documentElement.style.setProperty('--body-Linear-1-rgb', bodyLinearColorOne);
  document.documentElement.style.setProperty('--body-Linear-2-rgb', bodyLinearColorTwo);
  document.documentElement.style.setProperty('--box-Linear-1-rgb', linearColorOne);
  document.documentElement.style.setProperty('--contrast-rgb', contrastColor);
  document.documentElement.style.setProperty('--box-Linear-2-rgb', linearColorTwo);

};

export const useThemeStore = create(
  persist(
    (set) => ({
      sliderValue: 0,
      setTheme: (value) => {
        set({ sliderValue: value });
        updateThemeVariable(value);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) updateThemeVariable(state.sliderValue);
      },
    }
  )
);