import * as Slider from "@radix-ui/react-slider";
const ThemeToggle = () => {

return (
  <>

  <div className="flex flex-row gap-2 justify-center">

      <div className="p-2 flex flex-1 bg-amber-50 rounded-2xl">

        <Slider.Root className="relative flex items-center w-full h-3 touch-none" defaultValue={[40]}>
        <Slider.Track className="bg-gray-300 relative flex-1 h-1 rounded-full">
          <Slider.Range className="absolute bg-blue-500 h-1 rounded-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-5 h-5 bg-white rounded-full shadow" />
      </Slider.Root>
        
    </div>

    <div className="flex center rounded-full bg-amber-200 w-7 h-7"></div>
 </div>
  </>

  );
};
export default ThemeToggle;