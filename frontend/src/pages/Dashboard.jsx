import React, { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
    const navigate=useNavigate();
    const {companyData,setCompanyData,setCompanyToken}=useContext(AppContext);

    //Function to logout company
    const logout=async()=>{
        setCompanyToken(null);
        localStorage.removeItem('companyToken');
        setCompanyData(null);
        navigate('/');
    }

    useEffect(()=>{
        if(companyData){
            navigate('/dashboard/manage-jobs');
        }else{
            navigate('/dashboard/add-job');
        }
    },[companyData]);
  return (
    <div className='min-h-screen'>
       {/* navbar for dashboard */}
       <div className='shadow py-4'>
        <div className='px-5 flex justify-between items-center'>
            <img onClick={()=>navigate('/')} className='max-sm:w-28 sm:w-40 cursor-pointer' src={assets.logo} alt="" />
            {companyData &&
            (<div className='flex items-center gap-5'>
                <p className='max-sm:hidden text-lg text-slate-500 font-medium'>Welcome ! {companyData.name}</p>
                <div className='relative group'>
                    <img className='w-28' src={companyData.image} alt="" />
                    <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10 w-32 max-sm:w-24'>
                        <ul className='list-none m-0 py-2 bg-white rounded-md border text-sm flex flex-col items-start w-full'>
                             <li onClick={logout} className='py-1 px-2 cursor-pointer hover:bg-gray-200  text-red-500 font-medium w-full'>Logout</li>
                        </ul>
                    </div>
                </div>
            </div>)
            }
        </div>
       </div>
       <div className='flex items-start overflow-x-hidden'>
        {/* sidebar with addjob,manage jobs,view applications */}
        <div className='inline-block max-sm:min-w-10 sm:w-52 lg:w-64 min-h-screen border-r-2'>
            <ul className='flex flex-col items-start pt-5 text-gray-800 space-y-4'>
                <NavLink to={'/dashboard/add-job'} className={({isActive})=>`flex gap-3 items-center p-3 sm:px-6 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}>
                <img className='max-sm:w-6' src={assets.add_icon} alt="" />
                <p className='max-sm:hidden'>Add job</p>
                </NavLink>
                <NavLink to={'/dashboard/manage-jobs'} className={({isActive})=>`flex gap-3 items-center p-3 sm:px-6 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}>
                <img className='max-sm:w-6' src={assets.home_icon} alt="" />
                <p className='max-sm:hidden'>Manage jobs</p>
                </NavLink>
                <NavLink to={'/dashboard/view-applications'} className={({isActive})=>`flex gap-3 items-center p-3 sm:px-6 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}>
                <img className='max-sm:w-6' src={assets.person_tick_icon} alt="" />
                <p className='max-sm:hidden'>View applications</p>
                </NavLink>
            </ul>
        </div>
        <div className='w-full overflow-x-auto'>
            <Outlet/>
        </div>
       </div>
    </div>
  )
}

export default Dashboard