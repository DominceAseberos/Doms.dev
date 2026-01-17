import { useState, useCallback } from 'react';
import { TRACKLIST } from '../config/trackList';

export const useTrackID = () => {
  const firstCategory = Object.keys(TRACKLIST)[0]; 
  const defaultTrackID = (firstCategory && TRACKLIST[firstCategory].length > 0)
    ? TRACKLIST[firstCategory][0].id 
    : `932988438`; 

  // 2. Use State
  const [trackID, setTrackIDState] = useState(defaultTrackID);

  const setTrackID = useCallback((newID) => {
    setTrackIDState(newID);
  }, []);


  return {
    trackID,     
    setTrackID   
  };
};