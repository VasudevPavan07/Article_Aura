import React, { useState, useEffect, memo } from 'react';
import { API } from '../../service/Api.js';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const LikeButton = ({ postId, likes = [], currentUser, onUpdate }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const userHasLiked = likes.includes(currentUser?._id);
        setIsLiked(userHasLiked);
        setLikeCount(likes.length);
    }, [likes, currentUser]);

    const handleLike = async () => {
        if (isUpdating) return;
        
        setIsUpdating(true);
        try {
            const response = isLiked 
                ? await API.unlikePost(postId)
                : await API.likePost(postId);

            if (response.isSuccess && response.data) {
                
                setIsLiked(!isLiked);
                setLikeCount(response.data.likes.length);
                
                
                if (typeof onUpdate === 'function') {
                    onUpdate(postId, response.data);
                }
            }
        } catch (error) {
            console.error('Error updating like:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <button 
            onClick={handleLike}
            disabled={isUpdating}
            className={`flex items-center space-x-1 text-gray-600 hover:text-red-500 ${
                isUpdating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
            {isLiked ? (
                <HeartSolidIcon className="w-6 h-6 text-red-500" />
            ) : (
                <HeartIcon className="w-6 h-6" />
            )}
            <span>{likeCount}</span>
        </button>
    );
};

LikeButton.displayName = 'LikeButton';
export default LikeButton;