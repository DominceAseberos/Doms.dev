
import * as Slider from "@radix-ui/react-slider";
import { useThemeStore } from "./util/useThemeStore"; 


const ThemeToggle = () => {
  const { sliderValue, setTheme } = useThemeStore();

  return (
    <div className="flex flex-col gap-1  justify-center ">
      
      {/* Label */}
      <div className="flex justify-between  font-mono uppercase tracking-widest">
        <p className="label-font"
        style={{
          color: `rgb(var(--contrast-rgb))`
        }}
        >
          Dark
        </p>
        <p className="label-font"
         style={{
          color: `rgb(var(--contrast-rgb))`
        }}
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
                rgb(255, 0, 208) 100%
              )` 
            }} 
          />
        </Slider.Track>

        <Slider.Thumb
          className="block w-5 h-5 rounded-full border-2 border-white shadow-xl focus:outline-none hover:scale-110 transition-transform"
          style={{ 
            // Use the global CSS variable for the thumb color so it syncs perfectly
            backgroundColor: `rgb(var(--theme-rgb))` 
          }}
        />
      </Slider.Root>
      
   
      </div>
    </div>
  );
};

export default ThemeToggle;