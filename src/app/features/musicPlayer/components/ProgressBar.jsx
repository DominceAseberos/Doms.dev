export const ProgressBar = ({ progress, audioRef }) => (
  <div className="flex px-2">
    <div
      className="w-full h-1 rounded-full border-[0.5px] border-amber-50 overflow-hidden cursor-pointer"
      style={{
        backgroundColor: `rgb(var(--theme-rgb))`,
      }}
      onClick={(e) => {
        const width = e.currentTarget.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const duration = audioRef.current.duration;
        audioRef.current.currentTime = (clickX / width) * duration;
      }}
    >
      <div
        className="h-full transition-all duration-100 ease-linear"
        style={{
          width: `${progress}%`,
          backgroundColor: `rgb(var(--contrast-rgb))`,
        }}
      />
    </div>
  </div>
);
