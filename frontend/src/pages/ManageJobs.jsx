import React, { useContext, useEffect, useState } from 'react'
import { manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify';
import Loading from '../components/Loading'

const ManageJobs = () => {
  const navigate=useNavigate();
  const [jobs,setJobs]=useState(false);
  const {companyToken,backendUrl,fetchJobs}=useContext(AppContext);

  //function to fetch company job applications data

  const fetchCompanyJobs=async()=>{
    try {

      const {data}=await axios.get(backendUrl+'/api/company/list-jobs',{headers:{token:companyToken}});

      if(data.success){
        setJobs(data.jobsData.reverse());
        //reverse method to get lastest elements on top
      }
      else{
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error.message);
    }
  }

//function to change job visibility

const changeJobVisibility=async(id)=>{
  try {
    const {data}=await axios.post(backendUrl+'/api/company/change-visibility',{id},{headers:{token:companyToken}});
     
    if(data.success){
      toast.success(data.message);
      fetchCompanyJobs();
      fetchJobs();
    }
    else{
       toast.error(data.message)
    }

  } catch (error) {
    toast.error(error.message);
  }
}

useEffect(()=>{
   if(companyToken){
    fetchCompanyJobs();
   }
},[companyToken])

  return jobs?jobs.length===0 ?(<div className='flex items-center justify-center h-[70vh]'>
    <p className='text-xl sm:text-2xl animate-ping'>No Job posted</p></div>):(
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
              <th className='py-2 px-4 border-b text-left'>Job Title</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 border-b text-center'>Applicants</th>
              <th className='py-2 px-4 border-b text-left'>Visible</th>
            </tr>
          </thead>
          <tbody>
            {jobs && jobs.map((job,index)=>(
              <tr className='text-grey-700' key={index}>
                 <td className='py-2 px-4 border-b max-sm:hidden'>{index+1}</td>
                 <td className='py-2 px-4 border-b'>{job.title}</td>
                 <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.Date).format('ll')}</td>
                 <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                 <td className='py-2 px-4 border-b text-center'>{job.applicants}</td>
                 <td className='py-2 px-4 border-b'>
                  <input onChange={()=>changeJobVisibility(job._id)} className='scale-125 ml-4' type="checkbox" checked={job.visible}/>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex m-4 justify-end'>
          <button onClick={()=>navigate('/dashboard/add-job')} className='w-28 py-3 mt-4 bg-black/80 text-white rounded-lg text-sm'>Add new job</button>
        </div>
      </div>
    </div>
  ):<Loading />
}

export default ManageJobs