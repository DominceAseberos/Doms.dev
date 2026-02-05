export const Visualizer = ({ canvasRef }) => (
  <canvas
    ref={canvasRef}
    width={800}
    height={800}
    className="w-full h-full object-contain pointer-events-none"
  />
);