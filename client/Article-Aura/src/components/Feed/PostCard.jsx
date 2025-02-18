import React, { useState, memo, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import FollowButton from './FollowButton';
import { API } from '../../service/Api.js';
import { themeContext } from '../../context/ThemeContext';

const PostCard = memo(({ post, currentUser, onPostUpdate }) => {
    const { theme } = useContext(themeContext);
    const [showComments, setShowComments] = useState(false);
    const [currentPost, setCurrentPost] = useState(post);
    const [postUserId, setPostUserId] = useState(null);
    useEffect(() => {
        const fetchPostUserId = async () => {
            try {
                const response = await API.getUserByUsername(currentPost.username);
                if (response.data) {
                    setPostUserId(response.data._id);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };
    
        if (currentPost.username) {
            fetchPostUserId();
        }

        setCurrentPost(post);
        console.log('Post Data:', post);
        console.log('Current User:', currentUser);
    }, [post, currentUser,currentPost.username]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePostUpdate = (postId, updatedPostData) => {
        const updatedPost = updatedPostData.data || updatedPostData;
        setCurrentPost(updatedPost);
        if (typeof onPostUpdate === 'function') {
            onPostUpdate(postId, updatedPost);
        }
    };

    const handleFollowUpdate = (updatedUserData) => {
        if (typeof onPostUpdate === 'function') {
            onPostUpdate(null, null, updatedUserData);
        }
    };

    // Debug logs
//     console.log('Post data:', post);
//     console.log('Post likes:', post.likes);
//     console.log('Current user:', currentUser);
//     console.log('Current User:', currentUser);
// console.log('Post User:', currentPost.username);
// console.log('Are users different?', currentUser.username !== currentPost.username);
console.log('Full post structure:', currentPost);
    return (
        <div className={`${
            theme === 'dark' 
                ? 'bg-[#111111]  text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                : 'bg-white text-gray-800 shadow-md '
        } rounded-lg p-4 mb-4 max-w-4xl mx-auto`}>
            {/* Post Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-4">
                    <span className="font-medium">{currentPost.username}</span>
                    {currentUser && currentPost.username && 
                     currentUser.username !== currentPost.username &&    (
                        <FollowButton 
                            userId={currentPost.userId|| currentPost._id}
                            currentUser={currentUser}
                            onFollowUpdate={handleFollowUpdate}
                        />
                    )}
                </div>
                <span className="text-gray-500 text-sm">
                    {formatDate(post.createdDate)}
                </span>
            </div>

            {/* Post Title */}
            <Link to={`/post/${post._id}`}>
                <h2 className="text-lg font-bold mb-1 hover:text-blue-600">
                    {currentPost.title}
                </h2>
            </Link>

            {/* Post Description */}
            <div className="mb-2">
                <p className={`${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                } text-sm line-clamp-3`}>
                    {currentPost.description}
                </p>
                {currentPost.picture && (
                    <img 
                        src={currentPost.picture} 
                        alt={currentPost.title}
                        className="w-full h-48 mt-2 rounded-lg object-cover"
                    />
                )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center space-x-4">
                <LikeButton 
                    postId={currentPost._id}
                    likes={currentPost.likes}
                    currentUser={currentUser}
                    onUpdate={handlePostUpdate}
                />
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
                >
                    <ChatBubbleLeftIcon className="w-6 h-6" />
                    <span>{currentPost.comments?.length || 0}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <CommentSection 
                    postId={currentPost._id}
                    comments={currentPost.comments}
                    currentUser={currentUser}
                    onCommentAdded={handlePostUpdate}
                />
            )}
        </div>
    );
});

PostCard.displayName = 'PostCard';
export default PostCard;