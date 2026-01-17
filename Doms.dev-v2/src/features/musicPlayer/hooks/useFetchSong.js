import { useState, useEffect } from 'react';
import axios from 'axios';
import { TRACKLIST } from '../config/trackList';

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

        const allTracks = Object.values(TRACKLIST).flat();
        const localTrackData = allTracks.find(t => String(t.id) === String(activeTrackID));
        const localImageSrc = localTrackData?.imgSrc || PLACEHOLDER_ALBUM;


        const res = await axios.get(
          `https://api.audius.co/v1/tracks/${activeTrackID}?app_name=${AUDIUS_APP_NAME}`
        );

        const track = res.data.data;
        setCurrentPlaying(track);

        const streamURL = `https://api.audius.co/v1/tracks/${track.id}/stream?app_name=${AUDIUS_APP_NAME}`;
        /* pass data  */
        onTrackLoaded(streamURL);

       if (localImageSrc) {
          const img = new Image();
          img.src = localImageSrc;
          img.onload = () => {
            setCoverPhotoSrc(localImageSrc);
            setLoading(false);
          };

          
        img.onerror = () => {
            console.warn(`Failed to load local image: ${localImageSrc}`);
            setCoverPhotoSrc(PLACEHOLDER_ALBUM);
            setLoading(false);
          };
        }
         else {
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
