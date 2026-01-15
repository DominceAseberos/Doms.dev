export const Controls = ({ isPlaying, togglePlayPause }) => (
  <div className="flex flex-row justify-center h-fit pb-2 gap-5">
    {/* SHUFFLE */}
    <button className="active:scale-120 transition-all duration-200">
      <svg
        className="w-4 h-4 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13.484 9.166 15 7h5m0 0-3-3m3 3-3 3M4 17h4l1.577-2.253M4 7h4l7 10h5m0 0-3 3m3-3-3-3"
        />
      </svg>
    </button>

    {/* BACK */}
    <button>
      <svg
        className="active:scale-120 transition-all duration-200 w-5 h-5 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 6v12m8-12v12l-8-6 8-6Z"
        />
      </svg>
    </button>

    {/* PLAY */}
    <button
      className="active:scale-120 transition-all duration-200 rounded-full p-1"
      style={{
        backgroundColor: `rgb(var(--contrast-rgb))`,
      }}
      onClick={togglePlayPause}
    >
      {isPlaying ? (
        <svg
          className="active:scale-120 transition-all duration-200 w-5 h-5 text-gray-800"
          style={{
            color: `rgb(var(--theme-rgb))`,
          }}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 6H8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 0h-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z"
          />
        </svg>
      ) : (
        <svg
          className="active:scale-120 transition-all duration-200 w-5 h-5 text-gray-800"
          style={{
            color: `rgb(var(--theme-rgb))`,
          }}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>

    {/* FORWARD */}
    <button className="active:scale-120 transition-all duration-200">
      <svg
        className="w-5 h-5 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 6v12M8 6v12l8-6-8-6Z"
        />
      </svg>
    </button>

    {/* REPEAT */}
    <button className="active:scale-120 transition-all duration-200">
      <svg
        className="w-4 h-4 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
        />
      </svg>
    </button>
  </div>
);
