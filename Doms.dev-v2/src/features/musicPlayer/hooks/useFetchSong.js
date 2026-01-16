import { useState, useEffect } from 'react';
import axios from 'axios';

const PLACEHOLDER_ALBUM = '/placeholderAlbum.jpg';
const AUDIUS_APP_NAME = 'MyPortfolio';

export const useFetchTrack = (activeTrackID, onTrackLoaded, onError) => {
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [coverPhotoSrc, setCoverPhotoSrc] = useState(PLACEHOLDER_ALBUM);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeTrackID) return; 
    const fetchMusicToPlay = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://api.audius.co/v1/tracks/${activeTrackID}?app_name=${AUDIUS_APP_NAME}`
        );
        const track = res.data.data;
        setCurrentPlaying(track);
        console.log(activeTrackID);

        const streamURL = `https://api.audius.co/v1/tracks/${track.id}/stream?app_name=${AUDIUS_APP_NAME}`;
        /* pass data  */
        onTrackLoaded(streamURL);

        if (track.artwork?.['480x480']) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            setCoverPhotoSrc(track.artwork['480x480']);
            setLoading(false);
          };
          img.onerror = () => {
            setCoverPhotoSrc(PLACEHOLDER_ALBUM);
            setLoading(false);
          };
          img.src = track.artwork['480x480'];
        } else {
          setCoverPhotoSrc(PLACEHOLDER_ALBUM);
          setLoading(false);
        }
      } catch (err) {
        console.warn("❌ Fetch Failed:", err);

        if (onError) {
            console.log("⏭️ Auto-skipping to next track due to error...");
            onError(); 
        }

        setCoverPhotoSrc(PLACEHOLDER_ALBUM);
        setLoading(false);
      }
    };

    fetchMusicToPlay();

    return () => {
      setCoverPhotoSrc(PLACEHOLDER_ALBUM);
    };
  }, [activeTrackID]);

  return {
    currentPlaying,
    coverPhotoSrc,
    loading,
  };
};
