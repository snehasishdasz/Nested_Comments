import React, { useState, useEffect } from "react";
import axios from "axios";
import Comment from "../components/Comment";
import "../App.css";  // Make sure your CSS file is imported

const API_URL = "http://localhost:3001";

const CommentsPage = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const fetchComments = async () => {
        const res = await axios.get(`${API_URL}/comments`);
        setComments(res.data);
    };

    useEffect(() => {
        fetchComments();
    }, []);

    // [
    //     { id: 1, content: "Hello", parent_id: null },
    //     { id: 2, content: "Reply to Hello", parent_id: 1 },
    //     { id: 3, content: "Another comment", parent_id: null },
    //     { id: 4, content: "Reply to Reply", parent_id: 3 }
    // ]

    const nestComments = (comments, parentId = null) => {
        return comments
            .filter(c => c.parent_id === parentId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort newest first
            .map(c => ({
                ...c,
                children: nestComments(comments, c.id),
            }));
    };



    const nestedComments = nestComments(comments);

    const addComment = async () => {
        if (!newComment.trim()) return;
        await axios.post(`${API_URL}/comments`, { content: newComment, parent_id: null });
        setNewComment("");
        fetchComments();
    };

    return (
        <div className="app-container">
            <h2 className="header">Comments</h2>

            <form
                className="comment-form"
                onSubmit={e => {
                    e.preventDefault();
                    addComment();
                }}
            >
                <input
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write a comment"
                    required
                />
                <button type="submit">Post Comment</button>
            </form>

            <div>
                {/* [
                {id: 1, content: "Hello", children: [...] },
                {id: 3, content: "Another comment", children: [] }
                ] */}


                {nestedComments.map(comment => (
                    <Comment 
                    key={comment.id} 
                    comment={comment} 
                    fetchComments={fetchComments} 
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentsPage;
