import { useState } from 'react';

const Profile = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      {!imageLoaded && (
        <div
          className="w-full h-full rounded-2xl border animate-pulse"
          style={{
            border: `1px solid rgb(var(--theme-rgb))`,
            background: `linear-gradient(to bottom, #FFCBCB, #A3B894)`
          }}
        >
          <div className="w-full h-full bg-white/10 rounded-2xl" />
        </div>
      )}
      <img
        className={`w-full h-full rounded-2xl object-cover ${!imageLoaded ? 'hidden' : ''}`}
        src="./profile.png"
        alt=""
        onLoad={() => setImageLoaded(true)}
        style={{
          border: `1px solid rgb(var(--theme-rgb))`,
          background: `linear-gradient(to bottom, #FFCBCB, #A3B894)`
        }}
      />
    </>
  );
};
export default Profile;