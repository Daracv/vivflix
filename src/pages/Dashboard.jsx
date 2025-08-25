import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { getVideosByCreator, getVideosByUserActivity } from "../Services/api";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardVideos = async () => {
      try {
        let data = [];
        if (user.role === "creator") {
          data = await getVideosByCreator(user.id); // API: /videos/creator/:id
        } else if (user.role === "consumer") {
          data = await getVideosByUserActivity(user.id); // API: /videos/user-activity/:id
        }
        setVideos(data || []);
      } catch (err) {
        console.error("Error loading dashboard videos:", err);
      }
    };

    fetchDashboardVideos();
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">
        {user.role === "creator" ? "Creator Dashboard" : "My Activity"}
      </h2>

      {videos.length === 0 ? (
        <p className="mt-4 text-gray-600">
          {user.role === "creator"
            ? "You haven’t uploaded any videos yet."
            : "You haven’t rated or commented on any videos yet."}
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <li key={video.id} className="bg-white shadow rounded p-3">
              <video controls className="w-full h-40 object-cover mb-2">
                <source src={video.video_url} type="video/mp4" />
              </video>
              <h3 className="font-semibold">{video.title}</h3>
              <p className="text-sm text-gray-500">Genre: {video.genre}</p>
              <p className="text-sm">Producer: {video.producer}</p>
              <p className="text-sm">Publisher: {video.publisher}</p>
              <p className="text-sm">Age Rating: {video.age_rating}</p>
              <p className="text-xs text-gray-400">
                Uploaded: {new Date(video.upload_time).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
