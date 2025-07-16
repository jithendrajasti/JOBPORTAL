import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Navigate, useNavigate } from 'react-router-dom';

const Applications = () => {
  const navigate=useNavigate();
  const {user}=useUser();
  const {getToken}=useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const {backendUrl,userData,userApplications,fetchUserData,fetchUserApplications}=useContext(AppContext);

  const updateResume=async()=>{
    try {
      const formData=new FormData();
      formData.append('resume',resume);
      const token=await getToken();
      const{data}=await axios.post(backendUrl+'/api/user/update-resume',formData,{headers:{Authorization:`Bearer ${token}`}});

      if(data.success){
        await fetchUserData();
        toast.success(data.message);
      }
      else{
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error.message);
    }

    setIsEdit(false);
    setResume(null);
  }
useEffect(()=>{
  fetchUserApplications();
},[])
  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] mx-auto my-10'>
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {isEdit || userData && userData.resume==='' ?
            <>
              <label className='flex items-center gap-2' htmlFor="resume-upload">
                <p className='bg-blue-100 text-blue-600 px-4 py-1.5 rounded-md'>{resume ? resume.name : "select resume" }</p>
                <input id='resume-upload' onChange={(e) => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden />
                <img src={assets.profile_upload_icon} alt="" />
                <button onClick={updateResume} className='bg-green-100 border border-green-400 px-4 py-1.5 rounded-md m'>Save</button>
              </label>
            </> :
            <div className='flex gap-2'>
              <a className='bg-blue-100 text-blue-600 px-4 py-1.5 rounded-lg' href={userData ? userData.resume : ''} target='_blank'>Resume</a>
              <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5'>Edit</button>
            </div>
          }
        </div>
        <div>
          <h2 className='text-xl font-semibold mb-4'>Jobs applied</h2>
          <table className='min-w-full bg-white border rounded-lg'>
            <thead>
              <tr>
                <th className='py-3 px-4 border-b text-left'>Company</th>
                <th className='py-3 px-4 border-b text-left'>Job title</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
                <th className='py-3 px-4 border-b text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                userApplications.map((job, index) => true ? (
                  <tr className='align-middle' key={index}>
                    <td className='py-1.5 px-4 border-b max-sm:text-sm'>
                      <div className='flex items-center gap-2 '>
                        <img className='w-8 h-8' src={job.companyId.image} alt="" />
                        {job.companyId.name}
                      </div>
                    </td>
                    <td className=' py-1.5 px-4 border-b max-sm:text-sm'>{job.jobId.title}</td>
                    <td className='max-sm:hidden py-1.5 px-4 border-b max-sm:text-sm'>{job.jobId.location}</td>
                    <td className='max-sm:hidden py-1.5 px-4 border-b max-sm:text-sm'>{moment(job.date).format('ll')}</td>
                    <td className=' py-1.5 px-4 border-b max-sm:text-sm'>
                      <span className={`${job.status==='Accepted'?"bg-green-100":job.status==='Rejected'?"bg-red-100":"bg-amber-100"} px-4 py-1.5 rounded-lg`}>{job.status}</span></td>
                  </tr>
                ) : (
                  null
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Applications