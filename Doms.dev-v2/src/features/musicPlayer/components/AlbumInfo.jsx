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
    <div className="flex flex-row w-full justify-center h-fit gap-3 text-center p-2">
      <div className="rounded border-sky-100 border-[1.4px] w-12 h-12 overflow-hidden flex items-center justify-center">
        {loading ? (
          <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-400 rounded-full animate-spin" />
        ) : (
          <img
            className="rounded"
            src={coverPhotoSrc}
            alt="Album Cover"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>

      <div
        ref={containerRef}
        className="flex flex-col w-32 overflow-hidden justify-center relative mask-linear"
      >
        <div
          className="flex w-fit items-center"
          style={
            shouldSlide
              ? {
                  animation: `seamless-loop ${durationSlide}s linear infinite`,
                  width: "max-content",
                }
              : {}
          }
        >
          <p
            ref={textRef}
            className="whitespace-nowrap text-sm font-bold pr-8"
            style={{ color: `rgb(var(--contrast-rgb))` }}
          >
            {title}
          </p>

          {shouldSlide && (
            <p
              className="whitespace-nowrap text-sm font-bold pr-8"
              style={{ color: `rgb(var(--contrast-rgb))` }}
            >
              {title}
            </p>
          )}
        </div>

        <p
          className="label-font"
          style={{ color: `rgb(var(--contrast-rgb))` }}
        >
          Artist: {artistName}
        </p>
      </div>
    </div>
  );
};
