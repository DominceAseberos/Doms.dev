import { useState, useEffect } from 'react';
import axios from 'axios';
import { usePortfolioData } from '../../../hooks/usePortfolioData';

const PLACEHOLDER_ALBUM = '/placeholderAlbum.jpg';
const AUDIUS_APP_NAME = 'MyPortfolio';

export const useFetchTrack = (activeTrackID, onTrackLoaded, onError) => {
  const { trackList: TRACKLIST } = usePortfolioData();
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [coverPhotoSrc, setCoverPhotoSrc] = useState(PLACEHOLDER_ALBUM);
  const [isMetadataLoading, setIsMetadataLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (!activeTrackID) return;
    const fetchMusicToPlay = async () => {
      try {
        setIsMetadataLoading(true);
        setIsImageLoading(true);

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

        // Metadata is loaded once we have the track data and stream URL
        setIsMetadataLoading(false);

        if (localImageSrc) {
          const img = new Image();
          img.src = localImageSrc;
          img.onload = () => {
            setCoverPhotoSrc(localImageSrc);
            setIsImageLoading(false);
          };


          img.onerror = () => {
            setCoverPhotoSrc(PLACEHOLDER_ALBUM);
            setIsImageLoading(false);
          };
        }
        else {
          setCoverPhotoSrc(PLACEHOLDER_ALBUM);
          setIsImageLoading(false);
        }
      } catch (err) {

        if (onError) {
          onError();
        }

        setCoverPhotoSrc(PLACEHOLDER_ALBUM);
        setIsMetadataLoading(false);
        setIsImageLoading(false);
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
    isMetadataLoading,
    isImageLoading,
  };
};
