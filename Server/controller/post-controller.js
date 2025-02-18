import Post from '../models/post.js';

export const createPost = async (request, response) => {
    try {
        const post = await new Post(request.body);
        post.save();
        return response.status(200).json('Post saved successfully');
    } catch (error) {
        return response.status(500).json(error);
    }
}

export const getAllPosts = async (request, response) => {
    try {
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 5;
        const skip = (page - 1) * limit;

        // Add console logs for debugging
        console.log('Pagination Query:', {
            page,
            limit,
            skip,
        });

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        const posts = await Post.find()
            .sort({ createdDate: -1 })
            .skip(skip)
            .limit(limit);

        // Log the results
        console.log('Query Results:', {
            totalPosts,
            totalPages,
            postsReturned: posts.length,
            firstPostId: posts[0]?._id,
            lastPostId: posts[posts.length - 1]?._id
        });

        return response.status(200).json({
            posts,
            totalPages,
            currentPage: page,
            totalPosts
        });
    } catch (error) {
        console.error('Pagination Error:', error);
        return response.status(500).json({
            msg: 'Error while getting posts',
            error: error.message
        });
    }
};

export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        
        if (!post) {
            return response.status(404).json({
                isSuccess: false,
                message: 'Post not found'
            });
        }

        return response.status(200).json({
            isSuccess: true,
            data: post
        });
    } catch (error) {
        console.error('Error in getPost:', error);
        return response.status(500).json({
            isSuccess: false,
            message: error.message
        });
    }
};

export const updatePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }
        
        await Post.findByIdAndUpdate(request.params.id, { $set: request.body });

        return response.status(200).json('Post updated successfully');
    } catch (error) {
        return response.status(500).json(error);
    }
}

export const deletePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        
        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }
        
        await post.delete();

        return response.status(200).json('Post deleted successfully');
    } catch (error) {
        return response.status(500).json(error);
    }
}

export const likePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) {
            return response.status(404).json({
                isSuccess: false,
                message: 'Post not found'
            });
        }

        const userId = request.body.userId;
        if (!userId) {
            return response.status(400).json({
                isSuccess: false,
                message: 'User ID is required'
            });
        }

        // Check if user has already liked
        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        }

        await post.save();

        return response.status(200).json({
            isSuccess: true,
            data: post,
            message: 'Post liked successfully'
        });
    } catch (error) {
        console.error('Like post error:', error);
        return response.status(500).json({
            isSuccess: false,
            message: error.message
        });
    }
};

export const unlikePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) {
            return response.status(404).json({
                isSuccess: false,
                message: 'Post not found'
            });
        }

        const userId = request.body.userId;
        if (!userId) {
            return response.status(400).json({
                isSuccess: false,
                message: 'User ID is required'
            });
        }

        
        const index = post.likes.indexOf(userId);
        if (index !== -1) {
            post.likes.splice(index, 1);
        }

        await post.save();

        return response.status(200).json({
            isSuccess: true,
            data: post,
            message: 'Post unliked successfully'
        });
    } catch (error) {
        console.error('Unlike post error:', error);
        return response.status(500).json({
            isSuccess: false,
            message: error.message
        });
    }
};

export const addComment = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        
        if (!post) {
            return response.status(404).json({
                isSuccess: false,
                message: 'Post not found'
            });
        }

        const comment = {
            text: request.body.text,
            username: request.body.username,
            createdDate: new Date()
        };

        post.comments.push(comment);
        const updatedPost = await post.save();
        
        // Return the complete updated post
        return response.status(200).json({
            isSuccess: true,
            data: updatedPost,
            message: 'Comment added successfully'
        });
    } catch (error) {
        console.error('Error in addComment:', error);
        return response.status(500).json({
            isSuccess: false,
            message: error.message
        });
    }
};
