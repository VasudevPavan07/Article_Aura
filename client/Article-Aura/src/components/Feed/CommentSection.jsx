import React, { useState } from 'react';
import { API } from '../../service/Api';

const CommentSection = ({ postId, comments = [], currentUser, onCommentAdded }) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await API.addComment(postId, {
                text: newComment.trim(),
                username: currentUser?.username
            });

            if (response.isSuccess && response.data) {
                setNewComment('');
               
                if (typeof onCommentAdded === 'function') {
                    onCommentAdded(postId, response.data);  // Pass both postId and data
                }
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="mt-4">
            <div className="mb-4">
                {comments.map((comment, index) => (
                    <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                        <span className="font-semibold">{comment.username}: </span>
                        <span>{comment.text}</span>
                    </div>
                ))}
            </div>
            {currentUser && (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 p-2 border rounded"
                        disabled={isSubmitting}
                    />
                    <button 
                        type="submit"
                        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default CommentSection;