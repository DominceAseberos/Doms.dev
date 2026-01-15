import { useMusicPlayer } from './hooks';
import { AlbumInfo, Controls, ProgressBar, Visualizer } from './components';
import { marqueeStyle } from './styles/Marques';

const MusicPlayer = () => {
  const {
    isPlaying,
    togglePlayPause,
    progress,
    audioRef,
    setCurrentTime,
    currentPlaying,
    coverPhotoSrc,
    loading,
    title,
    artistName,
    textRef,
    containerRef,
    shouldSlide,
    durationSlide,
    canvasRef,
  } = useMusicPlayer();

  return (
    <>
      <style>{marqueeStyle}</style>

      <div
        className="music-style flex flex-col gap-2 justify-around"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(var(--box-Linear-1-rgb)),
            rgba(var(--box-Linear-2-rgb))
          )`,
        }}
      >
        <AlbumInfo
          currentPlaying={currentPlaying}
          coverPhotoSrc={coverPhotoSrc}
          loading={loading}
          textRef={textRef}
          containerRef={containerRef}
          shouldSlide={shouldSlide}
          durationSlide={durationSlide}
        />

        <ProgressBar progress={progress} audioRef={audioRef} />

        <Controls isPlaying={isPlaying} togglePlayPause={togglePlayPause} />


          <div className="fixed flex justify-center items-center h-58 w-58 rounded-full bottom-0 -right-4 z-100  ">
            <Visualizer canvasRef={canvasRef} />

          </div>
      </div>
    </>
  );
};

export default MusicPlayer;
