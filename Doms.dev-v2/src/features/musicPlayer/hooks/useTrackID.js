import { useState, useCallback } from 'react';
import { usePortfolioData } from '../../../hooks/usePortfolioData';

export const useTrackID = () => {
  const { trackList: TRACKLIST } = usePortfolioData();
  const preferredDefault = '2019678919';

  const firstCategory = Object.keys(TRACKLIST)[0];
  const firstTrackID =
    firstCategory && TRACKLIST[firstCategory].length > 0
      ? TRACKLIST[firstCategory][0].id
      : null;

  // Use preferred default if firstTrackID is missing
  const defaultTrackID = preferredDefault || firstTrackID;

  // State - initialized from localStorage if available
  const [trackID, setTrackIDState] = useState(() => {
    return localStorage.getItem('lastTrackID') || defaultTrackID;
  });

  // Setter with persistence
  const setTrackID = useCallback((newID) => {
    setTrackIDState(newID);
    localStorage.setItem('lastTrackID', newID);
  }, []);

  return {
    trackID,
    setTrackID,
  };
};
