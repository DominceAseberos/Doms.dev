// MusicPlayer.jsx
import { useMusicPlayer } from "./hooks/useMusicPlayer";
import { AlbumInfo } from "./components/AlbumInfo";
import { ProgressBar } from "./components/ProgressBar";
import { Controls } from "./components/Controls";
import { Visualizer } from "./components/Visualizer";
import { marqueeStyle } from "./styles/Marques";

const MusicPlayer = () => {
  const player = useMusicPlayer();

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
        <AlbumInfo {...player} />
        <ProgressBar {...player} />
        <Controls {...player} />
        <Visualizer canvasRef={player.canvasRef} />
      </div>
    </>
  );
};

export default MusicPlayer;
