export const Visualizer = ({ canvasRef }) => (
  <canvas
    ref={canvasRef}
    width={400}
    height={400}

    className="w-full h-full object-contain pointer-events-none z-50"
  />
);