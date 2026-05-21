import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Heart, MessageCircle, Settings, X, Plus } from "lucide-react";
import axios from "axios";

export default function Profile() {
  const { id: profileId } = useParams();
  const { user, profile: currentUserProfile, updateProfile, followToggle } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [picInput, setPicInput] = useState("");
  const [modalType, setModalType] = useState(null);

  const isOwnProfile = user?._id === profileId;

  const isFollowing = currentUserProfile?.following?.some(
    (f) => (f._id?.toString() || f.toString()) === profileId
  );

  useEffect(() => {
    fetchProfileAndPosts();
  }, [profileId]);

  const fetchProfileAndPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/user/${profileId}`);
      setProfileUser(res.data);
      setBioInput(res.data.user?.bio || "");
      setPicInput(res.data.user?.profilePicture || "");

      const feedRes = await axios.get("/api/feed/");
      const allPosts = feedRes.data.posts || [];
      const filtered = allPosts.filter(
        (post) => post.user?._id === profileId || post.user === profileId
      );
      setUserPosts(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      await followToggle(profileId, isFollowing);
      const res = await axios.get(`/api/user/${profileId}`);
      setProfileUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(bioInput, picInput);
      setProfileUser((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          bio: bioInput,
          profilePicture: picInput
        }
      }));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner" />
        <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading profile...</span>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>User not found</h2>
      </div>
    );
  }

  const pData = profileUser.user;
  const avatarText = profileUser.username?.substring(0, 2).toUpperCase() || "??";

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar-ring">
            {pData.profilePicture ? (
              <img src={pData.profilePicture} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="profile-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#333", fontSize: "2rem", fontWeight: "bold" }}>
                {avatarText}
              </div>
            )}
          </div>
        </div>

        <div className="profile-info-section">
          <div className="profile-row-1">
            <h2 className="profile-username">{profileUser.username}</h2>
            {profileUser.role && profileUser.role !== "user" && (
              <span className="post-badge">{profileUser.role}</span>
            )}
            {isOwnProfile ? (
              <button onClick={() => setIsEditModalOpen(true)} className="profile-edit-btn">
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                className="auth-button"
                style={{ marginTop: 0, padding: "6px 24px", fontSize: "0.85rem" }}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          <div className="profile-row-2">
            <div className="profile-stat">
              <span>{userPosts.length}</span> posts
            </div>
            <div
              className="profile-stat"
              style={{ cursor: pData.followers?.length ? "pointer" : "default" }}
              onClick={() => pData.followers?.length && setModalType("followers")}
            >
              <span>{pData.followers?.length || 0}</span> followers
            </div>
            <div
              className="profile-stat"
              style={{ cursor: pData.following?.length ? "pointer" : "default" }}
              onClick={() => pData.following?.length && setModalType("following")}
            >
              <span>{pData.following?.length || 0}</span> following
            </div>
          </div>

          <div className="profile-row-3">
            <p className="profile-bio">{pData.bio || "No bio yet."}</p>
          </div>
        </div>
      </header>

      {userPosts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
          <p style={{ fontSize: "1.1rem" }}>No posts shared yet.</p>
        </div>
      ) : (
        <div className="profile-grid">
          {userPosts.map((post) => (
            <div key={post._id} className="profile-grid-item">
              <img src={post.image} alt={post.caption} className="profile-grid-image" />
              <div className="profile-grid-overlay">
                <div className="profile-overlay-stat">
                  <Heart size={20} fill="currentColor" />
                  <span>{post.likes?.length || 0}</span>
                </div>
                <div className="profile-overlay-stat">
                  <MessageCircle size={20} fill="currentColor" />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="modal-input-group">
                <label className="modal-label">Bio</label>
                <textarea
                  className="modal-input"
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>
              <div className="modal-input-group">
                <label className="modal-label">Profile Picture URL</label>
                <input
                  type="text"
                  className="modal-input"
                  value={picInput}
                  onChange={(e) => setPicInput(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="modal-cancel">
                  Cancel
                </button>
                <button type="submit" className="modal-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: "350px" }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ textTransform: "capitalize" }}>{modalType}</h3>
              <button onClick={() => setModalType(null)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "300px", overflowY: "auto", padding: "10px 0" }}>
              {pData[modalType]?.map((item) => (
                <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold" }}>
                    {item.username?.substring(0, 2).toUpperCase() || "??"}
                  </div>
                  <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{item.username}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
