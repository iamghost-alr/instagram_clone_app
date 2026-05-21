import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Upload, AlertCircle } from "lucide-react";
import axios from "axios";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setError("");
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please select an image to share");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      await axios.post("/api/feed/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <h1 className="create-post-title">Create new post</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-post-body">
        {error && (
          <div style={{
            color: "var(--ig-red)",
            backgroundColor: "rgba(255, 48, 64, 0.1)",
            border: "1px solid rgba(255, 48, 64, 0.2)",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {!previewUrl ? (
          <label className="upload-dropzone">
            <Upload size={48} className="upload-icon" style={{ color: "var(--text-secondary)" }} />
            <span style={{ fontSize: "1rem", fontWeight: "500" }}>Drag photos and videos here</span>
            <span style={{
              backgroundColor: "var(--ig-blue)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              fontWeight: "600",
              marginTop: "10px"
            }}>
              Select from computer
            </span>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="upload-preview-container">
            <img src={previewUrl} alt="Preview" className="upload-preview" />
            <button
              type="button"
              className="change-photo-btn"
              onClick={() => {
                setFile(null);
                setPreviewUrl("");
              }}
            >
              Change Photo
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "600" }}>
            Write a caption
          </label>
          <textarea
            placeholder="Write a caption..."
            className="create-post-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={2200}
          />
        </div>

        <button
          type="submit"
          className="create-post-submit"
          disabled={loading || !file}
        >
          {loading ? "Sharing..." : "Share"}
        </button>
      </form>
    </div>
  );
}
