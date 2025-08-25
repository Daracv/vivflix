import { useState, useContext } from "react";
import { uploadVideo } from "../Services/api";
import { AuthContext } from "../context/AuthContext";

const Upload = () => {
  const { user } = useContext(AuthContext);
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [producer, setProducer] = useState("");
  const [publisher, setPublisher] = useState("");
  const [genre, setGenre] = useState("");
  const [ageRating, setAgeRating] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Token being sent:", localStorage.getItem("token"));
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("producer", producer);
    formData.append("publisher", publisher);
    formData.append("genre", genre);
    formData.append("age_rating", ageRating);

    try {
      await uploadVideo(formData);
      setMessage("Video uploaded successfully!");
      setTitle("");
      setProducer("");
      setPublisher("");
      setGenre("");
      setAgeRating("");
      setVideoFile(null);
    } catch (err) {
      console.error("Upload failed", err.response?.data || err.message);
      setMessage("Upload failed. Try again.");
    }
  };

  if (!user || user.role !== "creator") {
    return <p className="text-center mt-10 text-red-500">Access Denied</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload a Video</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          className="w-full mb-3"
          required
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Producer"
          value={producer}
          onChange={(e) => setProducer(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          placeholder="Publisher"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          placeholder="Age Rating"
          value={ageRating}
          onChange={(e) => setAgeRating(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default Upload;
