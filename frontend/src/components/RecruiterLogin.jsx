import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
const RecruiterLogin = () => {
  const navigate=useNavigate();
  const { setShowRecruiterLogin,backendUrl,setCompanyToken,setCompanyData} = useContext(AppContext);
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(false);

  const [isTextSubmitted, setIsTextSubmitted] = useState(false);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (state === 'Sign up' && !isTextSubmitted) {
      return setIsTextSubmitted(true);
    }

    try {
      
      if(state==='Login'){
        const {data}=await axios.post(backendUrl+'/api/company/login',{email,password});
        if(data.success){
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem('companyToken',data.token);
          setShowRecruiterLogin(false);
          navigate('/dashboard');
        }
        else{
          toast.error(data.message);
        }
      }
      else{
        const formData=new FormData()
        formData.append('name',name);
        formData.append('email',email);
        formData.append('password',password);
        formData.append('image',image);

        const {data}=await axios.post(backendUrl+'/api/company/register',formData);

        if(data.success){
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem('companyToken',data.token);
          setShowRecruiterLogin(false);
          navigate('/dashboard');
        }
        else{
          toast.error(data.message);
        }
      }

    } catch (error) {
      toast.error(error.message);
    }



  }
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [])
  return (
    <div className=' absolute top-0 left-0 bottom-0 z-10 right-0 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <form onSubmit={e => onSubmitHandler(e)} className='relative bg-white p-10 rounded-xl text-slate-500'>
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
        {state === 'Login' ?
          <p className='text-sm text-center'>Welcome back! please sign in to continue</p> : !isTextSubmitted &&
          <p className='text-sm text-center'>Hey ! please sign up to continue</p>}
        {state === 'Sign up' && isTextSubmitted ?
          <>
            <div className='flex items-center gap-4 my-10'>
              <label htmlFor="image">
                <img className='w-16 h-16 rounded-full' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                <input onChange={(e) => setImage(e.target.files[0])} type="file" hidden id="image" />
              </label>
              {image ? <p>Logo uploaded</p> : <p>Upload company <br />logo</p>}
            </div>
          </>
          :
          <>
            {state !== 'Login' && (<div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.person_icon} alt="" />
              <input className='outline-none text-sm' type="text" placeholder='Company name' required onChange={e => setName(e.target.value)} value={name} />
            </div>)}

            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.email_icon} alt="" />
              <input className='outline-none text-sm' type="email" placeholder='Email Id' required onChange={e => setEmail(e.target.value)} value={email} />
            </div>
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.lock_icon} alt="" />
              <input className='outline-none text-sm' type="password" placeholder='Password' required onChange={e => setPassword(e.target.value)} value={password} />
            </div>
            {state === 'Login' && <p className='text-sm text-blue-600 mt-4 cursor-pointer '>Forgot password ?</p>}
          </>
        }

        <button type='submit' className='bg-blue-600 w-full text-white py-2 rounded-full mt-4'>{state == "Login" ? 'login' : isTextSubmitted ? 'create account' : 'next'}</button>
        {
          state === 'Login' ?
            <p className='mt-5 text-center'>Don't have an account ? <span className='text-blue-600 cursor-pointer' onClick={e => setState('Sign up')}>Sign up</span></p> : !isTextSubmitted &&
            <p className='mt-5 text-center'>Already have an account ? <span className='text-blue-600 cursor-pointer' onClick={e => setState('Login')}>Login</span></p>
        }
        <img onClick={e => setShowRecruiterLogin(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt="" />
      </form>
    </div>
  )
}

export default RecruiterLogin