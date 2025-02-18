import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { API } from '../../service/Api';
import {DataContext} from '../../context/DataProvider.jsx'
import { useNavigate } from 'react-router-dom';

const signupIntialvalues={name:"",username:"",password:""}
const loginInitialValues ={ username:"",password:""}
const LoginForm = ({ isUserAuthenticated }) => {
    let [account,setAccount] =useState('login');
    let [login,setLogin] = useState(loginInitialValues);
    let [signup,setSignup]=useState(signupIntialvalues);
    let [error,seterror] =useState("");

    const {setAccount1} =useContext(DataContext)

    const navigate =useNavigate()

    useEffect(() => {
      seterror(false);
  }, [login])


let toggleSignup =()=>{
    account=="signup"?setAccount("login"):setAccount("signup")
}
let loginUser = async () => {
  try { 
    let response = await API.userLogin(login);
    if (response.isSuccess) {
      seterror('');
      console.log('Full login response:', response); // Debug log
      
      // Store tokens
      sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
      sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
      
      // Make sure we're getting the correct user ID from response
      const userId = response.data.userId || response.data._id; // Try both possibilities
      console.log('User ID from response:', userId);
      
      sessionStorage.setItem('userId', userId);
      
      setAccount1({ 
        username: response.data.username, 
        name: response.data.name,
        _id: userId
      });
      
      // Verify storage
      console.log('Stored userId:', sessionStorage.getItem('userId'));
      
      isUserAuthenticated(true);
      navigate('/',{ replace: true });
    } else {
      seterror('Something Went Wrong! Please try again later');
      toast.error("Invalid credentials")
    }
  } catch (error) {
    console.error('Login error:', error);
    seterror('Something Went Wrong! Please try again later');
    toast.error("Invalid credentials");
  }
};

let handleOnChange =(e)=>{
   let {name,value} =e.target;
setSignup({...signup,[name]:value})
console.log(value);
}

let signupUser =async()=>{
  
  let response = await  API.userSignup(signup);
  if(response.isSuccess){
    seterror('');
    setSignup(signupIntialvalues);
    toggleSignup('login');
    toast.success("Account created successfully");

  }else{
seterror('something went wrong.please try again')
  }
 
 
}

const onValueChange =(e)=>{

  setLogin({...login,[e.target.name]:e.target.value})
}

  return (
    <div className='bg-[black] min-h-screen'>
    <h1 className='text-center text-4xl md:text-6xl font-extrabold py-5 text-white'>Article Aura</h1>
    { account=="login"?
            <section className='flex flex-col w-[90%] md:w-[50%] lg:w-[30%] mx-auto p-2 bg-[#101112] text-white rounded-2xl mt-10 shadow-[0_0_10px_rgba(255,255,255,0.1)]'>
                <div className='flex flex-col w-[90%] md:w-[80%] mx-auto'>
                    <input onChange={(e)=>{onValueChange(e)}} value={login.username} name='username' className='border-b-[1px] p-1.5 mt-8 md:mt-10 outline-0' type="text" placeholder='Enter username' />
                    <input onChange={(e)=>{onValueChange(e)}} value={login.password} name='password' className='border-b-[1px] p-1.5 mt-8 md:mt-10 outline-0' type="password" placeholder='Enter password' />
                    <button className='p-2 bg-amber-300 mt-8 md:mt-10 text-black cursor-pointer font-bold rounded-[8px]' onClick={()=>{loginUser()}} type='submit'>Login</button>
                </div>
                <div className='flex flex-col w-[90%] md:w-[80%] mx-auto pb-5'>
                    <p className='text-center mt-5'>OR</p>
                    <button onClick={()=>{toggleSignup()}} className='p-2 mt-5 bg-blue-400 text-black cursor-pointer font-bold rounded-[8px]'>Create an account</button>
                </div>
            </section>:
            <section className='flex flex-col w-[90%] md:w-[50%] lg:w-[30%] mx-auto p-2 bg-[#101112] text-white rounded-2xl mt-10 md:mt-14 shadow-[0_0_10px_rgba(255,255,255,0.1)]'>
            <div className='flex flex-col w-[90%] md:w-[80%] mx-auto'>
                <input onChange={handleOnChange} name='name' className='border-b-[1px] p-1.5 mt-8 md:mt-10 outline-0' type="text" placeholder='Enter Name'/>
                <input onChange={handleOnChange} name='username' className='border-b-[1px] p-1.5 mt-8 md:mt-10 outline-0' type="text" placeholder='Enter username' />
                <input onChange={handleOnChange} name='password' className='border-b-[1px] p-1.5 mt-8 md:mt-10 outline-0' type="password" placeholder='Enter password' />
               {error&& <p className='text-[10px] text-red-600'>{error}</p>}
                <button onClick={()=>{signupUser()}} className='p-2 mt-8 md:mt-10 bg-blue-400 text-black cursor-pointer font-bold rounded-[8px]' type='submit'>Create Account</button>
            </div>
           
            <div className='flex flex-col w-[90%] md:w-[80%] mx-auto pb-5'>
                <p className='text-center mt-5'>OR</p>
                <button onClick={()=>{toggleSignup()}} className='p-2 bg-amber-300 mt-5 text-black cursor-pointer font-bold rounded-[8px]'>Already Have an account</button>
            </div>
        </section>
}
    </div>
  )
}

export default LoginForm;
