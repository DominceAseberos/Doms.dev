import { useState, useEffect } from 'react';
import axios from 'axios';

const PLACEHOLDER_ALBUM = '/placeholderAlbum.jpg';
const AUDIUS_TRACK_ID = 3232; /* 1087633 */
const AUDIUS_APP_NAME = 'MyPortfolio';

export const useFetchTrack = (onTrackLoaded) => {
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [coverPhotoSrc, setCoverPhotoSrc] = useState(PLACEHOLDER_ALBUM);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusicToPlay = async () => {
      try {
        const res = await axios.get(
          `https://api.audius.co/v1/tracks/${AUDIUS_TRACK_ID}?app_name=${AUDIUS_APP_NAME}`
        );
        const track = res.data.data;
        setCurrentPlaying(track);

        const streamURL = `https://api.audius.co/v1/tracks/${track.id}/stream?app_name=${AUDIUS_APP_NAME}`;
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
        console.warn(err);
        setCoverPhotoSrc(PLACEHOLDER_ALBUM);
        setLoading(false);
      }
    };

    fetchMusicToPlay();

    return () => {
      setCoverPhotoSrc(PLACEHOLDER_ALBUM);
    };
  }, []);

  return {
    currentPlaying,
    coverPhotoSrc,
    loading,
  };
};
