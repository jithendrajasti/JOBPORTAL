import React, { useContext, useEffect, useState } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from '../components/Loading';
const ViewApplications = () => {
  const {backendUrl,companyToken}=useContext(AppContext);

  const [applicants,setApplicants]=useState(false);

  //Function to fetch company job applications data

  const fetchCompanyApplicants=async()=>{
    try {
      const {data}=await axios.get(backendUrl+'/api/company/applicants',{headers:{token:companyToken}});

      if(data.success){
        setApplicants(data.applications.reverse());
        //reverse method adds latest applicants on top of the list
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  //function to update application status

  const updateStatus=async(id,status)=>{
        try {
          const {data}=await axios.post(backendUrl+'/api/company/change-status',{id,status},{headers:{token:companyToken}});
          if(data.success){
            fetchCompanyApplicants();
            toast.success(data.message);
          }
          else{
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
  }

  useEffect(()=>{
    if(companyToken){
      fetchCompanyApplicants();
    }
  },[companyToken])

  return applicants?applicants.length===0?(<div className='flex items-center justify-center h-[70vh]'>
    <p className='text-xl sm:text-2xl animate-ping'>
      No job applicants available
    </p>
  </div>):(
    <div className='container w-full mx-auto p-4'>
      <div>
        <table className='w-full max-w-4xl bg-white border border-gray-400 max-sm:text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='py-2 px-4 text-left'>#</th>
              <th className='py-2 px-4 text-left'>User name</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-left'>Resume</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant,index)=>(
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b text-left'>{index+1}</td>
                <td className='py-2 px-4 border-b text-left'>
                  <div className='flex items-center'>
                    <img className='w-10 h-10 rounded-full mr-3 max-sm:hidden' src={applicant.userId.image} alt="" />
                    <span>{applicant.userId.name}</span>
                  </div>
                </td>
                <td className='py-2 px-4 border-b text-left max-sm:hidden'>{applicant.jobId.title}</td>
                <td className='py-2 px-4 border-b text-left max-sm:hidden'>{applicant.jobId.location}</td>
                <td className='py-2 px-4 border-b text-left'>
                  <a href={applicant.userId.resume} target='_blank' className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center'>
                     Resume <img src={assets.resume_download_icon}></img>
                  </a>
                  </td>
                <td className='py-2 px-4 border-b relative'>
                  {applicant.status === 'Pending'
                  ?(<div className='group relative inline-block text-left'>
                    <button className='text-gray-500 action-button'>...</button>
                    <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block '>
                      <button onClick={()=>{
                        updateStatus(applicant._id,"Accepted");

                      }} className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100 '>Accept</button>
                      <button onClick={()=>{
                        updateStatus(applicant._id,"Rejected");
                        
                      }} className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 '>Reject</button>
                    </div>
                  </div>):
                  (<div className={applicant.status ==='Rejected'?'px-4 py-1 rounded bg-red-100 text-red-400':'px-4 py-1 rounded bg-green-100 text-green-400'}>{applicant.status}</div>)
                  }
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ):<Loading />
}

export default ViewApplications