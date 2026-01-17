
export const TRACKLIST = {
    chill: [
      { id: '932988438', imgSrc: '/images/chill/chill-1.jpg' }, 
      { id: '1586803530', imgSrc: '/images/chill/chill-2.jpg' },  
      { id: '1718890166', imgSrc: '/images/chill/chill-3.jpg' }, 
      { id: '313426506', imgSrc: '/images/chill/chill-4.jpg' }, 
      { id: '633064604', imgSrc: '/images/chill/chill-5.jpg' }, 
      { id: '413494', imgSrc: '/images/chill/chill-6.jpg' }, 
      { id: '971544', imgSrc: '/images/chill/chill-7.jpg' }, 

    ],
    drift: [
      { id: '658465526', imgSrc: '/images/drift/drift-1.jpg' },    
      { id: '902189369', imgSrc: '/images/drift/drift-2.jpg' },  
      { id: '1728867985', imgSrc: '/images/drift/drift-3.jpg' },  
      { id: '265802', imgSrc: '/images/drift/drift-4.jpg' },  
      { id: '265861', imgSrc: '/images/drift/drift-5.jpg' },  

    ],
    moody: [
      { id: '15921', imgSrc: '/images/moody/moody-1.jpg' }, 
      { id: '424675', imgSrc: '/images/moody/moody-2.jpg' },
      { id: '749798543', imgSrc: '/images/moody/moody-3.jpg' },
      { id: '1594755175', imgSrc: '/images/moody/moody-4.jpg' },
      { id: '457367', imgSrc: '/images/moody/moody-5.jpg' },

    ],

      fierce: [
      { id: '67531686', imgSrc: '/images/fierce/fierce-1.jpg' }, 
      { id: '184959303' , imgSrc: '/images/fierce/fierce-2.jpg' }, 
      { id: '2019678919', imgSrc: '/images/fierce/fierce-3.jpg' }, 
      { id: '891082411', imgSrc: '/images/fierce/fierce-4.jpg' }, 
      { id: '1051991608', imgSrc: '/images/fierce/fierce-5.jpg' }, 
    

    ],

      upbeat: [
      { id: '524115861',imgSrc: '/images/upbeat/upbeat-1.jpg' }, 
      { id: '329349',imgSrc: '/images/upbeat/upbeat-2.jpg' }, 
      { id: '10647679' ,imgSrc: '/images/upbeat/upbeat-3.jpg' }, 
      { id: '252278' ,imgSrc: '/images/upbeat/upbeat-4.jpg' }, 
      { id: '53435' ,imgSrc: '/images/upbeat/upbeat-5.jpg' }, 

      ]
  }

  export const MOOD_OPTIONS = Object.keys(TRACKLIST).map(key => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1) 
  }));