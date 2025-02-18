import { useState, useEffect, useContext, useCallback } from 'react';
import { API } from '../../service/Api.js';
import { DataContext } from '../../context/DataProvider';
import PostCard from './PostCard';
import { themeContext } from '../../context/ThemeContext';
const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const { account } = useContext(DataContext);
    const { theme } = useContext(themeContext);
    const fetchPosts = async () => {
        try {
            setLoading(true);
            console.log('Fetching page:', page);
            
            const response = await API.getAllPosts({ params: { page, limit: 5 }});
            console.log('API Response:', response);

            if (response.isSuccess) {
                // Check if we're getting different posts
                console.log('Previous posts:', posts);
                console.log('New posts:', response.data.posts);
                
                setPosts(response.data.posts);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page]); // Make sure page is in dependencies

    const handlePostUpdate = useCallback((postId, updatedPost) => {
        if (updatedPost && postId) {
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post._id === postId ? updatedPost : post
                )
            );
        }
    }, []);

    const handlePageChange = (newPage) => {
        console.log('Changing to page:', newPage);
        setPage(newPage);
    };

    return (
        <div className={`${
            theme === 'dark' 
                ? 'bg-[#111111]' 
                : 'bg-gray-50'
        } min-h-screen py-8`}>
            {loading ? (
                <div className={`text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Loading...</div>
            ) : (
                <>
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostCard 
                                key={post._id} 
                                post={post}
                                currentUser={account}
                                onPostUpdate={handlePostUpdate}
                            />
                        ))}
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-8 space-x-4">
                        <button
                            onClick={() => handlePageChange(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded ${
                                theme === 'dark'
                                    ? 'bg-gray-700 text-white disabled:bg-gray-600'
                                    : 'bg-gray-200 text-gray-800 disabled:bg-gray-100'
                            } disabled:opacity-50`}
                        >
                            Previous
                        </button>
                        <span className={`px-4 py-2 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-800'
                            }`}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className={`px-4 py-2 rounded ${
                                theme === 'dark'
                                    ? 'bg-gray-700 text-white disabled:bg-gray-600'
                                    : 'bg-gray-200 text-gray-800 disabled:bg-gray-100'
                            } disabled:opacity-50`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Feed;