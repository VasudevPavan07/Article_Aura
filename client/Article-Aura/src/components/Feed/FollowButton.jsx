import { useState, useEffect } from 'react';
import { API } from '../../service/Api.js';

const FollowButton = ({ userId, currentUser, onFollowUpdate }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log('FollowButton props:', {
            userId,
            currentUser,
            following: currentUser?.following
        });
        const isCurrentlyFollowing = currentUser?.following?.includes(userId);
        setIsFollowing(isCurrentlyFollowing);
    }, [userId, currentUser?.following]);

    const handleFollow = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            // Don't update state until API call succeeds
            const response = await API[isFollowing ? 'unfollowUser' : 'followUser'](userId);
            
            console.log('Follow/Unfollow response:', response);

            if (response.isSuccess) {
                setIsFollowing(!isFollowing);
                if (typeof onFollowUpdate === 'function') {
                    onFollowUpdate(response.data);
                }
            } else {
                console.error('Follow/Unfollow failed:', response);
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        } finally {
            setIsLoading(false);
        }
    };
    console.log('FollowButton - currentUser:', currentUser);
    console.log('FollowButton - userId to follow:', userId);

    console.log('FollowButton props:', { userId, currentUser });
    if (!userId || userId === currentUser?._id) {
        console.log('FollowButton not rendered:', { userId, currentUserId: currentUser?._id });
        return null;
    }
    if (!currentUser || !userId) {
        console.log('Missing required props:', { currentUser, userId });
        return null;
      }
    // Don't render if no userId or it's the current user
    if (!userId || userId === currentUser?._id) return null;

    return (
        <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
                isFollowing
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
            } disabled:opacity-50`}
        >
            {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
        </button>
    );
};

export default FollowButton;