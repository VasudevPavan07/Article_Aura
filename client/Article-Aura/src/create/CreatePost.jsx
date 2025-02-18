import { useContext, useEffect, useState } from "react";
import {
  BookmarkIcon as SaveIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { themeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { DataContext } from "../context/DataProvider";
import { API } from "../service/Api";

const intialPost = {
  title: "",
  description: "",
  picture: "",
  createdDate: new Date(),
};

const CreatePost = () => {
  const [isSaved, setIsSaved] = useState(true);
  const [post, setPost] = useState(intialPost);
  const [file,setFile] =useState(null);
  const navigate = useNavigate();
  

 
  const {account} =useContext(DataContext)
  let { theme} = useContext(themeContext);
  const authorName = account?.name; 

  const handleSave = () => {
    // Add your save logic here
    setIsSaved(true);
    // Simulate API call
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleChange =(e)=>{
    setPost({...post,[e.target.name]:e.target.value})
  }

  const url =post.picture?post.picture: 'https://cdn.pixabay.com/photo/2020/03/06/08/00/laptop-4906312_1280.jpg';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        // Add file type validation
        if (!selectedFile.type.match(/^image\/(png|jpg|jpeg)$/)) {
            alert('Please select a valid image file (PNG, JPG, JPEG)');
            return;
        }
        // Add file size validation (e.g., 5MB limit)
        if (selectedFile.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }
        console.log('Selected file:', selectedFile);
        setFile(selectedFile);
    }
  };

  useEffect(() => {
    const getImage = async () => { 
        if(file) {
            const data = new FormData();
            data.append("file", file);
            try {
              const response = await API.uploadFile(data);
              post.picture = response.data;
              setPost({ ...post });
            } catch (error) {
              console.error('Error uploading file:', error);
              console.log('Error details:', error.response?.data);
            }
        }
    }
    getImage();
    post.username = account.username;
}, [file])

  const handleSubmit = async () => {
    if (!post.title || !post.description) {
        alert('Title and Description are required');
        return;
    }

    try {
        // First upload the image if exists
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            
            const imageResponse = await API.uploadFile(formData);
            post.picture = imageResponse.data;
        }

        // Then create the post
        const response = await API.createPost(post);
        if (response.isSuccess) {
            navigate('/'); // Navigate to home/feed page
        }
    } catch (error) {
        console.error('Error creating post:', error);
    }
  };

  return (
    <div className={`${
        theme === 'dark' ? 'bg-[#101112] text-white' : 'bg-white text-gray-800'
      }`}>
      <div className={`${
        theme === 'dark' ? 'bg-[#101112] text-white' : 'bg-white text-gray-800'
      } max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        {/* Editor Header */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <span
              
                  className="text-2xl font-bold text-blac cursor-pointer"
                >
                  ArticleAura
                </span>
              </Link>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Draft in {authorName}</span>
                {isSaved && <span className="text-green-600 ml-2">Saved</span>}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              style={{
                border:
                  theme == "light" ? "2px solid green" : "2px solid yellow",
              }}
              className="flex items-center bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              Post
            </button>
          </div>
        </div>

        <div>
          <img src={url} className="h-[60vh] w-[80vw]" alt="" />
        </div>
        <label className="flex items-center pt-5 gap-2" htmlFor="fileinput">
          <PlusCircleIcon className="h-8 w-8  text-gray-600" />
          Add image
        </label>
        <input 
            onChange={handleFileChange}
            className="invisible" 
            type="file" 
            id="fileinput"
            accept="image/png, image/jpeg, image/jpg"
        />

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          
          onChange={handleChange}
          name="title"

          className="w-full text-5xl font-bold mt-8 mb-8 placeholder-gray-400 focus:outline-none"
        />

        {/* Content Editor */}
        <div className="min-h-screen">
          <textarea
          name="description"
          onChange={handleChange}
            placeholder="Tell your story..."
            className="w-full text-xl placeholder-gray-400 focus:outline-none resize-none min-h-[500px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
