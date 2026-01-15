// components/AlbumInfo.jsx
export const AlbumInfo = ({
  currentPlaying,
  coverPhotoSrc,
  loading,
  textRef,
  containerRef,
  shouldSlide,
  durationSlide,
  
}) => {
  const title = currentPlaying?.title || "Unknown Song";
  const artistName = currentPlaying?.user?.name || "Unknown Artist";

  return (
    <div className="flex flex-row w-full justify-center gap-3 p-2">
      <div className="rounded w-12 h-12 overflow-hidden flex items-center justify-center">
        {loading ? (
          <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-400 rounded-full animate-spin" />
        ) : (
          <img
            src={coverPhotoSrc}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>

      <div
        ref={containerRef}
        className="flex flex-col w-32 overflow-hidden justify-center"
      >
        <div
          className="flex w-fit"
          style={
            shouldSlide
              ? {
                  animation: `seamless-loop ${durationSlide}s linear infinite`,
                  width: "max-content",
                }
              : {}
          }
        >
          <p ref={textRef} className="whitespace-nowrap text-sm font-bold pr-8">
            {title}
          </p>
          {shouldSlide && (
            <p className="whitespace-nowrap text-sm font-bold pr-8">{title}</p>
          )}
        </div>

        <p className="label-font">Artist: {artistName}</p>
      </div>
    </div>
  );
};
