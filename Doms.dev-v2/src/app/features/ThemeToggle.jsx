import React, { useRef } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useThemeStore } from "./util/useThemeStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ThemeToggle = () => {
  const { sliderValue, setTheme } = useThemeStore();
  const thumbRef = useRef(null);

  const { contextSafe } = useGSAP({ scope: thumbRef });

  const onMouseEnter = contextSafe(() => {
    gsap.to(thumbRef.current, { scale: 1.2, duration: 0.3, ease: "power2.out" });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to(thumbRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  });

  return (
    <div className="flex flex-col gap-1  justify-center ">

      {/* Label */}
      <div className="flex justify-between  font-mono uppercase tracking-widest text-white">
        <p className="label-font"

        >
          Dark
        </p>
        <p className="label-font"

        >Vibrant
        </p>

      </div>

      <div className='flex flex-row justify-center gap-1 '>
        <Slider.Root
          className="relative flex items-center w-full h-3 select-none touch-none"
          value={[sliderValue]}
          max={100}
          step={1}
          onValueChange={(val) => setTheme(val[0])}
        >
          <Slider.Track className="relative flex-1 h-2 rounded-full overflow-hidden bg-white/10">

            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(to right, 
                rgb(21, 18, 38) 0%, 
                rgb(35, 0, 255) 50%, 
                rgb(178, 178, 150) 100%
              )`
              }}
            />
          </Slider.Track>

          <Slider.Thumb
            ref={thumbRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="block w-5 h-5 rounded-full border-2 border-white shadow-xl focus:outline-none cursor-pointer"
            style={{
              backgroundColor: `rgb(var(--theme-rgb))`
            }}
          />
        </Slider.Root>


      </div>
    </div>
  );
};

export default ThemeToggle;