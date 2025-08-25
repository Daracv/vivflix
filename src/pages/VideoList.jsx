import { useEffect, useState } from "react";
import { getVideos } from "../services/api";
import { Link } from "react-router-dom";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVideos(search);
        setVideos(data);
      } catch (error) {
        console.error("Failed to load videos", error);
      }
    };

    fetchData();
  }, [search]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Videos</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by genre or title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded w-full mb-6"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link key={video.id} to={`/videos/${video.id}`}>
            <div className="bg-white shadow rounded p-3 hover:shadow-lg transition">
              <video
                src={video.video_url}
                className="w-full h-40 object-cover mb-2 rounded"
                controls
              />
              <h2 className="font-semibold">{video.title}</h2>
              <p className="text-sm text-gray-600">{video.producer}</p>
              <p className="text-xs text-gray-500">Genre: {video.genre}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
