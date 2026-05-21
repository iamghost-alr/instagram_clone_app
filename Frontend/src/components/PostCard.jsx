import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import axios from "axios";

export default function PostCard({ post, onPostUpdate, onPostDelete }) {
  const { user, profile, followToggle } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  const isLiked = post.likes.includes(user?._id);
  const isPostOwner = post.user?._id === user?._id;
  const isAdmin = user?.role === "admin";
  const canDelete = isPostOwner || isAdmin;

  const isFollowing = profile?.following?.some(
    (f) =>
      (f._id?.toString() || f.toString()) === post.user?._id?.toString()
  );

  const handleLikeToggle = async () => {
    try {
      const url = `/api/feed/${post._id}/${isLiked ? "unlike" : "like"}`;
      const res = await axios.post(url);
      onPostUpdate(res.data.post);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 300) {
      handleDoubleTap();
    }
    setLastClickTime(now);
  };

  const handleDoubleTap = async () => {
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 800);
    if (!isLiked) {
      try {
        const res = await axios.post(`/api/feed/${post._id}/like`);
        onPostUpdate(res.data.post);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFollowClick = async () => {
    try {
      await followToggle(post.user._id, isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/api/feed/delete/${post._id}`);
      onPostDelete(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(`/api/feed/${post._id}/comment`, {
        comment: commentText
      });
      onPostUpdate(res.data.post);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <article className="post-card">
      <header className="post-header">
        <div className="post-header-left">
          <div className="post-avatar-wrapper">
            <div className="post-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#333", fontSize: "0.8rem", fontWeight: "bold" }}>
              {post.user?.username?.substring(0, 2).toUpperCase() || "??"}
            </div>
          </div>
          <div className="post-user-info">
            <span className="post-username">
              {post.user?.username || "anonymous"}
              {post.user?.role && post.user.role !== "user" && (
                <span className="post-badge">{post.user.role}</span>
              )}
            </span>
          </div>
          {!isPostOwner && (
            <>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>•</span>
              <button onClick={handleFollowClick} className="post-follow-btn">
                {isFollowing ? "Following" : "Follow"}
              </button>
            </>
          )}
        </div>
        {canDelete && (
          <button onClick={handleDelete} className="post-delete-btn">
            <Trash2 size={18} />
          </button>
        )}
      </header>

      <div className="post-image-container" onClick={handleImageClick}>
        <img src={post.image} alt={post.caption} className="post-image" />
        <Heart
          className={`double-click-heart ${showHeartPop ? "animate" : ""}`}
          size={80}
          fill="white"
        />
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button
            onClick={handleLikeToggle}
            className={`post-action-btn ${isLiked ? "liked" : ""}`}
          >
            <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="post-action-btn"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      </div>

      <div className="post-likes-count">
        {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
      </div>

      <div className="post-caption">
        <span className="post-caption-username">{post.user?.username || "anonymous"}</span>
        {post.caption}
      </div>

      {post.comments?.length > 0 && (
        <button
          onClick={() => setShowComments(!showComments)}
          className="post-comments-toggle"
        >
          {showComments
            ? "Hide comments"
            : `View all ${post.comments.length} comments`}
        </button>
      )}

      {showComments && post.comments?.length > 0 && (
        <div className="post-comments-section">
          {post.comments.map((comment) => (
            <div key={comment._id} className="post-comment-item">
              <span className="post-comment-username">
                {comment.user?.username || "anonymous"}
              </span>
              <span className="post-comment-text">{comment.content}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleCommentSubmit} className="post-comment-input-area">
        <input
          type="text"
          placeholder="Add a comment..."
          className="post-comment-input"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          className="post-comment-btn"
          disabled={!commentText.trim()}
        >
          Post
        </button>
      </form>
    </article>
  );
}
