// Post form for creating new posts

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPost, getPostById, updatePost } from "../../services/postService";

const Loader = () => <div className="loader">Loading...</div>;

const PostForm = ({ handleAddPost, handleUpdatePost }) => {
  const navigate = useNavigate();
  const { postId } = useParams();

  const initialState = {
    content: "",
    tag: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
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
      const postData = formData

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
        const postData = await PostService.getPostById(postId);
        if (!postData) throw new Error('Post not found');
        setFormData(postData);
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
      <h1>{postId ? "Edit Post" : "Create New Post"}</h1>
      <form className="vintage-form" onSubmit={handleSubmit}>


        <div className="form-group">
          <label htmlFor="content-input">Post Content</label>
          <textarea
            name="content"
            id="content-input"
            className="vintage-textarea"
            placeholder="The Posts Content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tag-input">add a #tag</label>
          <textarea
            name="tag"
            id="tag-input"
            className="vintage-textarea"
            placeholder="Add a #"
            value={formData.tag}
            onChange={handleChange}
          />

          <button>Add a Tag</button>

        </div>


        <div className="form-actions">
          <button
            className="vintage-button"
            type="submit"
            disabled={uploading || loading}
          >
            {loading ? (
              <div style={{ display: 'flex', alignPosts: 'center', gap: '0.5rem' }}>
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