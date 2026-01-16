
  export const TRACKLIST = {
    chill: [
      { id: '932988438' }, 
      { id: '1087633' },  
      { id: '123' }, 
    ],
    gym: [
      { id: '3221' },  
      { id: '4214' }, 
      { id: '1087633' },  
    ],
    focus: [
      { id: '4444' },
      { id: '41235' },
    ]
  };

  export const MOOD_OPTIONS = Object.keys(TRACKLIST).map(key => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1) 
  }));