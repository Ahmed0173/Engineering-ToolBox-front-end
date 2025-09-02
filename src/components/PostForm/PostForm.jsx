// Post form for creating new posts

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPost, getPostById, updatePost } from "../../services/postService";
import "./PostForm.scss";

const Loader = () => <div className="loader">Loading...</div>;

const PostForm = ({ handleAddPost, handleUpdatePost }) => {
  const navigate = useNavigate();
  const { postId } = useParams();

  const initialState = {
    content: "",
    tag: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleTagInputChange = (evt) => {
    setCurrentTag(evt.target.value);
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const newTag = currentTag.trim().startsWith('#') ? currentTag.trim() : `#${currentTag.trim()}`;
      setTags([...tags, newTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      addTag();
    }
  };

  const handleImageUpload = async (evt) => {
    const file = evt.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "dbtxztzci");
    data.append("cloud_name", "dbtxztzci");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dbtxztzci/images/upload`,
        { method: "POST", body: data }
      );
      const uploaded = await res.json();
      setFormData({ ...formData, images: uploaded.secure_url });
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    try {
      // Include tags in the form data
      const postData = {
        ...formData,
        tags: tags
      };

      console.log('About to submit:', postData);

      let result;
      if (postId) {
        result = await handleUpdatePost(postId, postData);
      } else {
        // Fix: Use the prop directly
        result = await handleAddPost(postData);
      }

      if (!result) {
        throw new Error('No result returned from server');
      }

      navigate("/posts");
    } catch (error) {
      console.error("Form submission failed:", error);
      // Improve error message
      alert(error.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };





  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      setFetching(true);
      try {
        const postData = await getPostById(postId);
        if (!postData) throw new Error('Post not found');
        setFormData(postData);
        // Set tags if they exist in the post data
        if (postData.tags && Array.isArray(postData.tags)) {
          setTags(postData.tags);
        }
      } catch (error) {
        console.error("Failed to fetch post", error);
        alert('Failed to fetch post details');
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (fetching) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Loader />
      </main>
    );
  }

  return (
    <main className="post-form-container">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/posts")}
        aria-label="Go back to posts"
      >
        ← Back to Posts
      </button>

      <form className="vintage-form" onSubmit={handleSubmit}>
        <h2>{postId ? "Edit Post" : "Create New Post"}</h2>

        <div className="form-group">
          <label htmlFor="content-input">Post Content</label>
          <textarea
            name="content"
            id="content-input"
            className="vintage-textarea"
            placeholder="Share your engineering knowledge, ask questions, or start a discussion..."
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tag-input">Add Tags</label>
          <div className="tag-input-container">
            <input
              type="text"
              name="tag"
              id="tag-input"
              className="vintage-input"
              placeholder="Enter a tag (e.g. mechanical, electrical, software)"
              value={currentTag}
              onChange={handleTagInputChange}
              onKeyPress={handleKeyPress}
            />
            <button
              type="button"
              className="vintage-button tag-button"
              onClick={addTag}
              disabled={!currentTag.trim()}
            >
              Add Tag
            </button>
          </div>

          {/* Display current tags */}
          {tags.length > 0 && (
            <div className="tags-display">
              <p>Current tags:</p>
              <div className="tags-list">
                {tags.map((tag, index) => (
                  <span key={index} className="tag-chip">
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag} tag`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>


        <div className="form-actions">
          <button
            className="vintage-button"
            type="submit"
            disabled={uploading || loading}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader />
                <span>Processing...</span>
              </div>
            ) : postId ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default PostForm;