export const Visualizer = ({ canvasRef }) => (
  <div className="w-32 h-32 flex justify-center bg-amber-50 fixed right-4 bottom-12 z-100">
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      className="absolute bottom-16 left-0 w-full h-24 opacity-30 pointer-events-none z-0"
    />
  </div>
);
