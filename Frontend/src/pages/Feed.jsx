import { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/feed/");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const mockStories = [
    { id: 1, name: "john_doe" },
    { id: 2, name: "alex_w" },
    { id: 3, name: "creative_mind" },
    { id: 4, name: "travel_blogger" },
    { id: 5, name: "nature_pics" },
    { id: 6, name: "fit_lifestyle" }
  ];

  return (
    <div className="feed-container">
      <div className="stories-bar">
        {mockStories.map((story) => (
          <div key={story.id} className="story-item">
            <div className="story-ring">
              <div className="story-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#333", fontSize: "0.9rem", fontWeight: "bold", color: "#fff" }}>
                {story.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <span>{story.name}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner" />
          <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading feed...</span>
        </div>
      ) : posts.length === 0 ? (
        <div style={{
          backgroundColor: "var(--bg-dark)",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          padding: "40px 20px",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>No posts yet</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Make sure to register as an Influencer to create posts!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdate={handlePostUpdate}
              onPostDelete={handlePostDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
