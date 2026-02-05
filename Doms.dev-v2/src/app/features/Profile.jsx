import { useState } from 'react';
import { usePortfolioData } from "@shared/hooks/usePortfolioData";
import { useImageMotion } from '@shared/hooks/useImageMotion';

const Profile = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { profile } = usePortfolioData();
  const { ref, onEnter, onLeave } = useImageMotion();

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="w-full h-full rounded-2xl overflow-hidden cursor-pointer"
    >
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
        src={profile.avatar}
        alt={profile.name}
        onLoad={() => setImageLoaded(true)}
        style={{
          border: `1px solid rgb(var(--theme-rgb))`,
          background: `linear-gradient(to bottom, #FFCBCB, #A3B894)`
        }}
      />
    </div>
  );
};
export default Profile;