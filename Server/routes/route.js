import express from 'express';
import { createPost, getAllPosts, getPost, updatePost, deletePost, likePost, addComment, unlikePost } from '../controller/post-controller.js';
import { uploadImage, getImage } from '../controller/image-controller.js';
import { signupUser, loginUser, followUser, unfollowUser } from '../controller/user-controller.js';
import upload from '../utils/upload.js';

const router = express.Router();

// User routes
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.put('/follow/:id', followUser);
router.put('/unfollow/:id', unfollowUser);

// Post routes
router.post('/create', createPost);
router.get('/posts', getAllPosts);
router.get('/post/:id', getPost);
router.put('/update/:id', updatePost);
router.delete('/delete/:id', deletePost);
router.put('/post/like/:id', likePost);
router.put('/api/post/like/:id', likePost);
router.put('/api/post/unlike/:id', unlikePost);
router.post('/post/comment/:id', addComment);

// Image routes
router.post('/file/upload', upload.single('file'), uploadImage);
router.get('/file/:filename', getImage);

// Add a test route
router.get('/upload-status', (req, res) => {
    res.json({ status: 'Upload endpoint is working' });
});

// Add this route for comments
router.post('/api/comments/:id', addComment);


router.get('/api/post/:id', getPost);
router.post('/api/post/comment/:id', addComment);

export default router;