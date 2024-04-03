// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const VideoLoop = () => {
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [videoUrls, setVideoUrls] = useState([]);
//   const [list, setList] = useState([]);
//   const [show, setShow] = useState(false);
//   const [listIndex, setListIndex] = useState(0);

//   useEffect(() => {
//     const videoElement = document.getElementById('video');

//     const handleEnded = () => {
//       setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoUrls.length);
//       listHandle();
//     };

//     const listHandle = () => {
//       setListIndex((prevIndex) => (prevIndex + 1) % list.length);
//     };

//     videoElement.addEventListener('ended', handleEnded);

//     videoElement.src = videoUrls[currentVideoIndex];

//     return () => {
//       videoElement.removeEventListener('ended', handleEnded);
//     };
//   }, [currentVideoIndex, videoUrls, list]);

//   useEffect(() => {
//     const getVideos = () => {
//       axios.get("https://carousal-backend.onrender.com/api/videos/")
//         .then(res => {
//           const videos = res.data.map(item => 'https://carousal-backend.onrender.com' + item.video_file);
//           setVideoUrls(videos);
//         })
//         .catch(error => {
//           console.error("Error fetching videos:", error);
//         });
//     };

//     const getList = () => {
//       axios.get("https://carousal-backend.onrender.com/titlesubtitlemodels/")
//         .then(res => {
//           const fetchedList = res.data;
//           setList(fetchedList);
//           console.log(fetchedList);
//         })
//         .catch(error => {
//           console.error("Error fetching list:", error);
//         });
//     };

//     getVideos();
//     getList();
//   }, []);

//   useEffect(() => {
//     // Display title/subtitle when a new video starts
//     setShow(true);
//     // Hide title/subtitle after 7 seconds
//     const timeout = setTimeout(() => setShow(false), 7000);
//     return () => clearTimeout(timeout);
//   }, [currentVideoIndex, listIndex]);

//   return (
//     <div className="w-full h-screen flex justify-center items-center">
//       <video id="video" className="w-full h-full object-cover" autoPlay muted>
//         <source src={videoUrls[currentVideoIndex]} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       {show && (
//         <div className="absolute inset-0 flex justify-center items-center bg-gray-800 text-white p-4">
//           <div className="text-center">
//             <h2 className="text-lg font-semibold">{list[listIndex]?.title}</h2>
//             <p className="text-sm">{list[listIndex]?.sub_title}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoLoop;


import { useState, useEffect } from 'react';
import axios from 'axios';

const VideoLoop = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoUrls, setVideoUrls] = useState([]);
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [listIndex, setListIndex] = useState(0);
  const [phase, setPhase] = useState('videos'); // Phase: 'videos' or 'list'

  useEffect(() => {
    const videoElement = document.getElementById('video');

    const handleEnded = () => {
      // Move to the next video in the array
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoUrls.length);
    };

    // Add event listener for 'ended' event to reset the loop
    videoElement.addEventListener('ended', handleEnded);

    // Set the video source
    videoElement.src = videoUrls[currentVideoIndex];

    return () => {
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [currentVideoIndex, videoUrls]);

  useEffect(() => {
    const getVideos = () => {
      axios.get("https://carousal-backend.onrender.com/api/videos/")
        .then(res => {
          const videos = res.data.map(item => 'https://carousal-backend.onrender.com' + item.video_file);
          setVideoUrls(videos);
        })
        .catch(error => {
          console.error("Error fetching videos:", error);
        });
    };

    const getList = () => {
      axios.get("https://carousal-backend.onrender.com/titlesubtitlemodels/")
        .then(res => {
          const fetchedList = res.data;
          setList(fetchedList);
        })
        .catch(error => {
          console.error("Error fetching list:", error);
        });
    };

    getVideos();
    getList();
  }, []);

  useEffect(() => {
    if (currentVideoIndex === videoUrls.length - 1 && phase === 'videos') {
      // After showing all videos, switch to the list phase
      setPhase('list');
      setShow(false); // Hide any currently displayed list item
      setTimeout(() => {
        // After a delay, start showing the list items
        setListIndex(0); // Reset list index
        setShow(true); // Show the first list item
      }, videoUrls.length * 2000);
    }
  }, [currentVideoIndex, videoUrls, phase]);

  useEffect(() => {
    if (show && phase === 'list') {
      // After showing a list item, move to the next one after 2 seconds
      const timeout = setTimeout(() => {
        setListIndex((prevIndex) => (prevIndex + 1) % list.length);
        if (listIndex === list.length - 1) {
          // If all list items have been shown, switch back to the video phase
          setPhase('videos');
          setCurrentVideoIndex(0); // Reset video index
          setShow(false); // Hide the last list item
        }
      }, 7000);
      return () => clearTimeout(timeout);
    }
  }, [show, listIndex, list.length, phase]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <video id="video" className="w-full h-full object-cover" autoPlay muted>
        <source src={videoUrls[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {show && phase === 'list' && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-800 text-white p-4">
          <div className="text-center">
            <h2 className="text-6xl font-semibold">{list[listIndex]?.title}</h2>
            <p className="text-2xl mt-5 text-gray-300">{list[listIndex]?.sub_title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLoop;