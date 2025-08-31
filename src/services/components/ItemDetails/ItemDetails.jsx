import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as itemService from "../../services/itemService";
import CommentForm from "../CommentForm/CommentForm";
import Loader from "../Loading/loader";

const ItemDetails = ({ user }) => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemData = await itemService.show(itemId);
        setItem(itemData);
      } catch (err) {
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleAddComment = async (commentData) => {
    try {
      const newComment = await itemService.createComment(commentData, itemId);
      setItem((prevItem) => ({
        ...prevItem,
        comments: [...prevItem.comments, newComment],
      }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await itemService.deleteItem(itemId);
      navigate("/items");
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await itemService.deleteComment(itemId, commentId);
      setItem((prevItem) => ({
        ...prevItem,
        comments: prevItem.comments.filter(
          (comment) => comment._id !== commentId
        ),
      }));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

const handleUpdateComment = async (commentId) => {
  try {
    const updatedComment = await itemService.updateComment(
      itemId,
      commentId,
      { text: editCommentText }
    );

    setItem(prevItem => ({
      ...prevItem,
      comments: prevItem.comments.map(comment => 
        comment._id === commentId ? { ...comment, text: editCommentText } : comment
      )
    }));

    setEditingCommentId(null);
    setEditCommentText("");
  } catch (err) {
    console.error("Error updating comment:", err);
  }
};

if (loading) return (
  <main style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
    <Loader />
  </main>
);
  if (!item) return <main>Item not found</main>;

  return (
    <main className="item-details-container">
      <header className="item-header">
        <span>{item.category?.toUpperCase()}</span>
       

        <div>
          <span>Posted by {item.user?.username}</span>
          <span>
            {item.condition} - {item.status}
          </span>
        </div>

        <p>{item.description}
          <br />
          Contact Information: {item.contact}
        </p>


        {item.images && <img src={item.images} alt={item.title} />}

        {item.user._id === user?._id && (
          <div>
            <Link to={`/items/${itemId}/edit`}>Edit</Link>
            <button onClick={handleDeleteItem}>Delete</button>
          </div>
        )}
      </header>

      <section className="comments-section">
        <h2>Comments</h2>
        <CommentForm handleAddComment={handleAddComment} user={user} />

        {item.comments?.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          <ul>
            {item.comments?.map((comment) => (
              <li key={comment._id}>
               {editingCommentId === comment._id ? (
  <div className="new-comment" >
    <textarea
      value={editCommentText}
      onChange={(e) => setEditCommentText(e.target.value)}
    />
    <div className="comment-buttons">
      <button className="save-btn" onClick={() => handleUpdateComment(comment._id)}>Save</button>
      <button onClick={handleCancelEdit}>Cancel</button>
    </div>
  </div>
) : (
  <div>
    <p>{comment.text}</p>
    <span>- {comment.author?.username}</span>
    {user?._id && comment.author?._id?.toString() === user._id.toString() && (
      <div className="comment-buttons">
        <button className="edit-btn" onClick={() => handleStartEdit(comment)}>Edit</button>
        <button className="delete-btn" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
      </div>
    )}
  </div>
)}

              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default ItemDetails;