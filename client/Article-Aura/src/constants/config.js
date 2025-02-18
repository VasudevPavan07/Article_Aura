export const API_NOTIFICATION_MESSAGES ={
    loading :{
        title:'loading...',
        message:'data is being loaded,please wait'
    },
    success:{
        title:'Success',
        message:"data successfully loaded"
    },
    responseFailure:{
        title:'Error',
        message:'An error occured while fetching response from the server.plese try again'
    },
    requestFailure :{
        title:'Error',
        message:'An error occured while parsing request data'
    },
    networkError:{
        title:'Error',
        message:'unable to connect with the server. Please check internet connectivity and try again  '

    }
}

export const SERVICE_URLS ={
    userSignup :{ url:'/signup',method:'POST'},
    userLogin:{url:'/login',method:'POST'},
    uploadFile:{url:'file/upload',method:'POST'},
    createPost: { url: '/create', method: 'POST' },
    getAllPosts: { url: '/posts', method: 'GET', params: true },
    getPostById: { url: '/post', method: 'GET', query: true },
    updatePost: { url: '/update', method: 'PUT', query: true },
    deletePost: { url: '/delete', method: 'DELETE', query: true },
    likePost: { url: 'post/like', method: 'POST', query: true },
    unlikePost: { url: 'post/unlike', method: 'POST', query: true },
    addComment: { url: 'post/comment', method: 'POST', query: true },
    followUser: { url: 'follow', method: 'PUT', query: true },
    unfollowUser: { url: 'unfollow', method: 'PUT', query: true }
}