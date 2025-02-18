import axios from 'axios';
import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config';

const API_URL = 'http://localhost:8000';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,  
    headers: {
        'Content-Type': 'application/json'
    }
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => {
        return {
            isSuccess: true,
            data: response.data
        };
    },
    (error) => {
        console.error('API Error:', error);
        return {
            isSuccess: false,
            error: error.message
        };
    }
);

const processResponse = (response) => {
    if (response?.status === 200) {
        return { isSuccess: true, data: response.data };
    } else {
        return {
            isFailure: true,
            status: response?.status,
            msg: response?.data?.msg || 'Unexpected error',
            code: response?.data?.code || 'Unknown'
        };
    }
};

const processError = (error) => {
    if (error.response) {
        console.log('ERROR IN RESPONSE:', error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure,
            code: error.response.status
        };
    } else if (error.request) {
        console.log('ERROR IN REQUEST:', error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.responseFailure,
            code: ''
        };
    } else {
        console.log('ERROR:', error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkError,
            code: ''
        };
    }
};

const API = {};

for (const [key, value] of Object.entries(SERVICE_URLS)) {
    API[key] = (body, showUploadProgress, showDownloadProgress) =>
        axiosInstance({
            method: value.method,
            url: value.url,
            data: body,
            responseType: value.responseType,
            onUploadProgress: function(progressEvent) {
                if (showUploadProgress) {
                    let percentageCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    showUploadProgress(percentageCompleted);
                }
            },
            onDownloadProgress: function(progressEvent) {
                if (showDownloadProgress) {
                    let percentageCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    showDownloadProgress(percentageCompleted);
                }
            },
        });
}

API.uploadFile = (data) => {
    console.log('Uploading file with FormData:', data);
    
    for (let pair of data.entries()) {
        console.log('FormData content:', pair[0], pair[1]);
    }
    
    return axiosInstance({
        method: 'POST',
        url: '/file/upload',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 30000, 
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log('Upload progress:', percentCompleted);
        }
    });
}




API.followUser = async (userId) => {
    try {
        const currentUserId = sessionStorage.getItem('userId');
        console.log('Follow Request:', {
            url: `/follow/${userId}`,
            method: 'PUT',
            body: { userId: currentUserId }
        });

        const response = await axiosInstance.put(`/follow/${userId}`, {
            userId: currentUserId
        });

        console.log('Follow Response:', response);
        return {
            isSuccess: true,
            data: response.data
        };
    } catch (error) {
        console.error('Follow Error Full Details:', {
            error,
            config: error.config,
            response: error.response
        });
        return {
            isSuccess: false,
            error: error.message
        };
    }
};

API.unfollowUser = async (userId) => {
    try {
        const currentUserId = sessionStorage.getItem('userId');
        console.log('Unfollow Request:', {
            url: `/unfollow/${userId}`,
            method: 'PUT',
            body: { userId: currentUserId }
        });

        const response = await axiosInstance.put(`/unfollow/${userId}`, {
            userId: currentUserId
        });

        console.log('Unfollow Response:', response);
        return {
            isSuccess: true,
            data: response.data
        };
    } catch (error) {
        console.error('Unfollow Error Full Details:', {
            error,
            config: error.config,
            response: error.response
        });
        return {
            isSuccess: false,
            error: error.message
        };
    }
};

API.likePost = async (postId) => {
    try {
        const userId = sessionStorage.getItem('userId');
        
        if (!userId || userId === 'undefined') {
            throw new Error('Valid user ID not found');
        }

        const response = await axiosInstance({
            method: 'PUT',
            url: `/api/post/like/${postId}`,
            data: { userId },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return {
            isSuccess: true,
            data: response.data.data
        };
    } catch (error) {
        console.error('Like post error:', error);
        return {
            isSuccess: false,
            error: error.message
        };
    }
};

API.unlikePost = async (postId) => {
    try {
        const userId = sessionStorage.getItem('userId');
        
        if (!userId || userId === 'undefined') {
            throw new Error('Valid user ID not found');
        }

        const response = await axiosInstance({
            method: 'PUT',
            url: `/api/post/unlike/${postId}`,
            data: { userId },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return {
            isSuccess: true,
            data: response.data.data
        };
    } catch (error) {
        console.error('Unlike post error:', error);
        return {
            isSuccess: false,
            error: error.message
        };
    }
};

API.addComment = async (postId, comment) => {
    try {
        const response = await axiosInstance.post(`/api/post/comment/${postId}`, comment);
        console.log('Add comment response:', response.data); // Debug log
        
        return {
            isSuccess: true,
            data: response.data
        };
    } catch (error) {
        console.error('Error adding comment:', error);
        return {
            isSuccess: false,
            error: error.message
        };
    }
};

API.getComments = async (postId) => {
    try {
        return await axiosInstance({
            method: 'GET',
            url: `/post/comments/${postId}`,
            headers: {
                'Authorization': sessionStorage.getItem('accessToken')
            }
        });
    } catch (error) {
        return processError(error);
    }
};

API.getPostById = async (postId) => {
    try {
        const response = await axiosInstance.get(`/api/post/${postId}`);
        console.log('Get post response:', response.data); // Debug log
        
        if (response.data) {
            return {
                isSuccess: true,
                data: response.data
            };
        }
        throw new Error('Post not found');
    } catch (error) {
        console.error('Error fetching post:', error);
        return {
            isSuccess: false,
            error: error.message
        };
    }
};

API.getAllPosts = async ({ params }) => {
    try {
        console.log('API call params:', params);
        const response = await axiosInstance.get('/posts', { params });
        console.log('API response:', response);
        return response;
    } catch (error) {
        console.error('API error:', error);
        return {
            isSuccess: false,
            error: error.message
        };
    }
};

export const getUserByUsername = async (username) => {
    try {
        return await axios.get(`${API_URL}/users/username/${username}`);
    } catch (error) {
        console.error('Error fetching user by username:', error);
        throw error;
    }
};

export { API };
