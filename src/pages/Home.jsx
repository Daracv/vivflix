// src/Pages/Home.jsx
import { useEffect, useState } from "react";
import { getVideos } from "../services/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="px-4 py-6">
      {videos.length === 0 ? (
        <p className="text-center text-gray-600">No videos uploaded yet.</p>
      ) : (
        <div className="flex flex-col items-center space-y-10 max-w-md mx-auto px-4 py-6">
          {videos.map((video) => (
            <Link
              to={`/videos/${video.id}`}
              key={video.id}
              className="w-full bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
            >
              <video
                src={video.video_url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-[500px] object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.genre}</p>
                <p className="text-xs text-gray-400">
                  Rated: {video.age_rating}
                </p>
                <div className="flex items-center justify-between text-gray-500 text-sm mt-2">
                  <span>💬 {video.comment_count}</span>
                  <span>
                    ⭐ {video.average_rating} ({video.rating_count})
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
