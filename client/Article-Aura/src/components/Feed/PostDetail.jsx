import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../service/Api';
import { DataContext } from '../../context/DataProvider';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import FollowButton from './FollowButton';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { account } = useContext(DataContext);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            console.log('Fetching updated post data');
            const response = await API.getPostById(id);
            console.log('Updated post data:', response);
            
            if (response.isSuccess) {
                setPost(response.data);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (!post) {
        return <div className="text-center py-8">Post not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Post Header */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">{post.username}</span>
                            {account.username !== post.username && (
                                <FollowButton 
                                    userId={post.userId} 
                                    currentUser={account}
                                />
                            )}
                        </div>
                        <span className="text-gray-500">
                            {formatDate(post.createdDate)}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    
                    {/* Post Image */}
                    {post.picture && (
                        <img 
                            src={post.picture} 
                            alt={post.title}
                            className="w-full h-96 object-cover mb-6"
                        />
                    )}

                    {/* Post Content */}
                    <div className="prose max-w-none mb-6">
                        <p>{post.description}</p>
                    </div>

                    {/* Interactions */}
                    <div className="border-t pt-4">
                        <div className="flex items-center space-x-4 mb-6">
                            <LikeButton 
                                postId={post._id}
                                likes={post.likes}
                                currentUser={account}
                                onUpdate={fetchPost}
                            />
                            <span className="text-gray-600">
                                {post.comments.length} Comments
                            </span>
                        </div>

                        {/* Comments */}
                        <CommentSection 
                            postId={post._id}
                            comments={post.comments}
                            currentUser={account}
                            onUpdate={fetchPost}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
