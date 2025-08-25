import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getVideoById, postComment, postRating } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);

  // Fetch video details (with comments + rating) once
  const fetchVideoData = async () => {
    try {
      const data = await getVideoById(id); // returns the full JSON from backend
      setVideo(data);
      setComments(
        [...data.comments].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );
      if (data.user_rating) setUserRating(data.user_rating);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const data = await getVideoById(id); // backend returns video + comments + ratings
        setVideo(data);
        setComments(
          (data.comments || []).sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        );
        setUserRating(data.user_rating || 0);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideoData();
  }, [id, user]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await postComment(id, { content: newComment });
      setNewComment("");
      await fetchVideoData(); // refresh after posting
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarClick = async (rating) => {
    try {
      await postRating(id, { rating });
      setUserRating(rating);
      await fetchVideoData(); // refresh rating stats
    } catch (error) {
      console.error("Failed to submit rating:", error);
      alert("Error submitting rating");
    }
  };

  if (!video) return <p className="p-4">Loading video...</p>;

  return (
    <div className="p-6 w-1/2 m-auto">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <video
        src={video.video_url}
        controls
        className="w-full max-w-4xl rounded mb-4"
      />

      <p className="text-gray-700 mb-1">Producer: {video.producer}</p>
      <p className="text-gray-700 mb-1">Publisher: {video.publisher}</p>
      <p className="text-gray-700 mb-1">Genre: {video.genre}</p>
      <p className="text-gray-700 mb-4">Age Rating: {video.age_rating}</p>

      {/* Rating */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Average Rating: {video.average_rating} / 5 ({video.rating_count}{" "}
          votes)
        </h3>
        {user && (
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-2xl ${
                  star <= userRating ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">(Click to rate)</span>
          </div>
        )}
      </div>

      {/* Comments */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Comments</h2>
      {comments.length > 0 ? (
        <ul className="space-y-2">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border p-2 rounded bg-gray-50 text-sm"
            >
              <span className="font-semibold mr-2">{comment.user}</span>
              <span>{comment.content}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600">No comments yet.</p>
      )}

      {user ? (
        <form onSubmit={handleCommentSubmit} className="mb-4 mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-600 mt-4">
          You must be logged in to post comments.
        </p>
      )}
    </div>
  );
};

export default VideoPlayer;
