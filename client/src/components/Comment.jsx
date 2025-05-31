import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const API_URL = "http://localhost:3001";

const Comment = ({ comment, fetchComments }) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");

    const postReply = async () => {
        if (!replyText.trim()) return;
        await axios.post(`${API_URL}/comments`, {
            content: replyText,
            parent_id: comment.id,
        });
        setReplyText("");
        setShowReplyBox(false);
        fetchComments();
    };

    // Format timestamp nicely
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); // You can customize this format
    };

    return (
        <div className={comment.parent_id ? "comment-container" : "comment-box"}>
            <div className="comment-header">
                <p>{comment.content}</p>
                <small className="timestamp">{formatDate(comment.created_at)}</small>
            </div>

            <button
                className="reply-btn"
                onClick={() => setShowReplyBox(!showReplyBox)}
            >
                {showReplyBox ? "Cancel" : "Reply"}
            </button>

            {showReplyBox && (
                <form
                    className="reply-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        postReply();
                    }}
                >
                    <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply"
                        required
                    />
                    <button type="submit">Post Reply</button>
                </form>
            )}

            {comment.children.map((child) => (
                <Comment key={child.id} comment={child} fetchComments={fetchComments} />
            ))}
        </div>
    );
};

export default Comment;
