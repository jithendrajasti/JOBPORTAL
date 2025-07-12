import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
const Navbar = () => {
    const navigate =useNavigate();
    const { openSignIn } = useClerk();
    const { user,isSignedIn } = useUser();
    const {setShowRecruiterLogin}=useContext(AppContext);
    return (
        <div className='shadow py-4'>
            <div className='container px-2 sm:px-4 2xl:px-10 mx-auto flex items-center justify-between min-w-full'>
                <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='h-8 sm:h-12 px-0 cursor-pointer' />
                {isSignedIn ?
                    (<div className='flex items-center gap-3 text-lg'>
                        <Link className='font-semibold text-[16px] sm:text-lg hover:underline' to='/applications'>Applied Jobs</Link>
                        <p>|</p>
                        <p className=' hidden sm:inline'>Hi, <span className='font-semibold'>{ user.firstName+" "+user.lastName}</span></p>
                        <UserButton/> 
                    </div>) : 
                    (<div className='flex gap-4 max-sm:text-xs'>
                        <button onClick={()=>setShowRecruiterLogin(true)} className='text-gray-600 text-[16px] sm:text-lg font-medium hover:text-black'>Recruiter login</button>
                        <button onClick={e => openSignIn()} className='bg-blue-600 text-[16px] sm:text-lg text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-full font-medium'>Login</button>
                    </div>)}

            </div>
        </div>
    )
}

export default Navbar