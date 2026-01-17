import { useState, useCallback } from 'react';
import { TRACKLIST } from '../config/trackList';

export const useTrackID = () => {
  const preferredDefault = '1051991608';

  const firstCategory = Object.keys(TRACKLIST)[0];
  const firstTrackID =
    firstCategory && TRACKLIST[firstCategory].length > 0
      ? TRACKLIST[firstCategory][0].id
      : null;

  // Use preferred default if firstTrackID is missing
  const defaultTrackID = preferredDefault || firstTrackID;

  // State
  const [trackID, setTrackIDState] = useState(defaultTrackID);

  // Setter
  const setTrackID = useCallback((newID) => {
    setTrackIDState(newID);
  }, []);

  return {
    trackID,
    setTrackID,
  };
};
