/* eslint-disable react-hooks/rules-of-hooks */

import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavBar from "../adminNavBar/AdminNavBar";

function adminVedioList() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get("https://carousal-backend.onrender.com/api/videos/")
      .then((response) => {
        setVideos(response.data);
        console.log(response.data)
      })

      .catch((error) => {
        console.error("Error fetching title:", error);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this item?"
      );

      if (confirmDelete) {
        await axios.delete(
          `https://carousal-backend.onrender.com/api/videos/${id}/`
        );
        const response = await axios.get(
          "https://carousal-backend.onrender.com/api/videos/"
        );
        setVideos(response.data);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <>
      <AdminNavBar />

      <div className="">
        <div className="flex items-center justify-center mt-20">
          <div className="overflow-x-auto h-3/5 w-3/5 max-lg:w-ful p-5 max-lg:px-4 rounded-md border-2 shadow-md bg-white">
            <div className="flex justify-around max-sm:grid items-center">
              <div>
                <h1 className="mb-5 text-3xl font-bold max-lg:text-xl">
                  Videos
                </h1>
              </div>
            </div>
            <table className="min-w-full bg-white border border-gray-300 mt-3">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 justify-center">
                    No
                  </th>
                  <th className="border border-gray-300 p-2 justify-center">
                    Title
                  </th>
                  <th className="border border-gray-300 p-2 flex items-center justify-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="border-r border-gray-300 p-3 font-medium">
                      {index + 1}
                    </td>

                    <td className="border-r border-gray-300 p-3 ">
                      {video.title}
                    </td>
                    <td className="flex justify-center p-2">
                      <button
                        onClick={() => handleDelete(video.id)}
                        className=" h-10 w-20 hover:bg-red-700 bg-black rounded-lg text-white hover:scale-105"
                      >
                        Delete
                      </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default adminVedioList;
