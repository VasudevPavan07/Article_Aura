import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import DataProvider from './context/DataProvider';
import { themeContext } from './context/ThemeContext';
import Navbar from './components/home/NavBar';
import LoginForm from '../src/components/accounts/LoginForm'
import Feed from './components/Feed/Feed.jsx';
import CreatePost from './create/CreatePost';
import PostDetail from './components/Feed/PostDetail.jsx';
import ThemeContext from './context/ThemeContext';
import Home from './components/home/Home.jsx';

const PrivateRoute = ({ isAuthenticated, ...props }) => {
    const token = sessionStorage.getItem('accessToken');
    return isAuthenticated && token ? 
      <>
        <Navbar />
        <Outlet />
      </> : <Navigate replace to='/' />
  };


const App = () => {
    const [isAuthenticated, isUserAuthenticated] = useState(false);
    return (
        <DataProvider>
            <ThemeContext>
                <BrowserRouter>
                    {/* Show Navbar only when authenticated */}
                    {/* {isAuthenticated && <Navbar />} */}
                    
                    <div className={isAuthenticated ? 0 : ""}>
                        <Routes>
                            <Route path='/login' element={
                                isAuthenticated ? 
                                    <Navigate to="/" /> : 
                                    <LoginForm isUserAuthenticated={isUserAuthenticated} />
                            } />
                            
                            {/* Protected Routes */}
                            <Route path='/' element={
                                isAuthenticated ? 
                                    <Home /> : 
                                    <Navigate to="/login" />
                            } />

                            <Route path='/create' element={
                                isAuthenticated ? 
                                    <CreatePost /> : 
                                    <Navigate to="/login" />
                            } />

                            <Route path='/post/:id' element={
                                isAuthenticated ? 
                                    <PostDetail /> : 
                                    <Navigate to="/login" />
                            } />
                        </Routes>
                    </div>
                </BrowserRouter>
            </ThemeContext>
        </DataProvider>
    );
}

export default App
