import { useContext, useState,useRef,useEffect } from 'react';
import { UserIcon, PencilIcon } from '@heroicons/react/24/outline';
import { themeContext } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import { DataContext } from '../../context/DataProvider';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   let {theme} =useContext(themeContext);
   const { account } = useContext(DataContext);
   const [showDropdown, setShowDropdown] = useState(false);
   const dropdownRef = useRef(null);

   useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);


  return (
    <nav   className={`${
            theme === 'dark' ? 'bg-[#151515]   text-white' : 'bg-white text-gray-800'
        } shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span  className="text-2xl font-bold cursor-pointer">
              ArticleAura
            </span>
          </div>

          {/* Center Section - Navigation Items (Desktop) */}
          <div className="hidden md:flex space-x-8 items-center">
           <Link to='/'>
           <button
              className={`
                ${theme === 'light' ? 'text-gray-600' : 'text-white'}
                hover:${theme === 'light' ? 'text-black' : 'text-white]'}
                transition-colors duration-200 text-sm font-medium flex items-center cursor-pointer
              `}
            >
              Home
            </button></Link>
            <Link to='/create'>
           
            <button 
  className={`
    ${theme === 'light' ? 'text-gray-600' : 'text-white'}
    hover:${theme === 'light' ? 'text-black' : 'text-white]'}
    transition-colors duration-200 text-sm font-medium flex items-center cursor-pointer
  `}
>
          
              <PencilIcon className="h-4 w-4 mr-1" />
              Write Article
           
          </button>
          </Link>
            <div><ThemeToggle /></div>
          </div>

          {/* Right Section - Profile */}
          <div className="relative" ref={dropdownRef}>
            <button 
                className="flex items-center space-x-1"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                </div>
            </button>

            {/* Dropdown Card */}
            {showDropdown && (
                <div className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg ${
                    theme === 'dark' 
                        ? 'bg-[#151515] text-white' 
                        : 'bg-white text-gray-800'
                } ring-1 ring-black ring-opacity-5`}>
<div className="p-4">
                        <div className="mb-3">
                            <label className="text-sm font-medium opacity-75">Username</label>
                            <p className="font-semibold">{account?.username}</p>
                        </div>
                        <div className="mb-3">
                            <label className="text-sm font-medium opacity-75">Name</label>
                            <p className="font-semibold">{account?.name}</p>
                        </div>
                        <div className="mb-3">
                            <label className="text-sm font-medium opacity-75">User ID</label>
                            <p className="text-sm font-mono">{account?._id}</p>
                        </div>
                        <hr className={`my-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />
                        <div className="text-sm text-center">
                            <button 
                                onClick={() => setShowDropdown(false)}
                                className={`w-full py-2 rounded-md ${
                                    theme === 'dark' 
                                        ? 'hover:bg-gray-700' 
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                Close
                   </button>
                        </div>
                    </div>
                </div>
            )}
        </div>





          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-black focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <Link 
              to="/" 
              className="block text-gray-600 hover:text-black py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link 
              to="/create" 
              className=" text-gray-600 hover:text-black py-2 text-sm font-medium flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Write Article
            </Link>
            <div><ThemeToggle /></div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;