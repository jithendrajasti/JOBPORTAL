import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { assets } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment'
import JobCard from '../components/JobCard';
import Footer from '../components/Footer'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
const ApplyJob = () => {
  const navigate=useNavigate();
  const jobsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const {getToken}=useAuth();
  const [jobData, setJobData] = useState(null);
  const [isAlreadyApplied,setIsAlreadyApplied]=useState(false);
  const { jobs,backendUrl,userData,userApplications,fetchUserApplications } = useContext(AppContext);

  const fetchJob = async () => {
     try {
       const {data}=await axios.get(backendUrl+`/api/jobs/${id}`);
       if(data.success){
        setJobData(data.job);
       }
       else{
        toast.error(data.message);
       }
     } catch (error) {
      toast.error(error.message);
     }
  }

  const ApplyHandler=async()=>{
    try {
      if(!userData){
        return toast.error('Login to apply for Jobs');
      }
      if(userData.resume===''){
        navigate('/applications');
        return toast.error('upload Resume to apply');
      }
      const token =await getToken();

      const {data}=await axios.post(backendUrl+'/api/user/apply-job',{jobId:jobData._id},{headers:{Authorization:`Bearer ${token}`}});

      if(data.success){
        toast.success(data.message);
        fetchUserApplications();
      }
      else{
        toast.error(data.message);
      }
      navigate('/applications');
    } catch (error) {
      toast.error(error.message);
    }
  }
 const checkAlreadyApplied=()=>{
  const hasApplied=userApplications.some(item=>item.jobId._id === jobData._id);
  setIsAlreadyApplied(hasApplied);
 }
  useEffect(() => {
    fetchJob();
  }, [id]);

  const [otherJobs, setOtherJobs] = useState([]);

  useEffect(() => {
  if (jobData?.companyId?._id) {
    const filtered = jobs.filter(
      (job) =>
        job._id !== jobData._id && job.companyId?._id === jobData.companyId._id && (!userApplications.some(item=>item.jobId._id === job._id))
    );
    setOtherJobs(filtered);
    setCurrentPage(1); // Reset to first page
  }
}, [jobData,userApplications]); 

useEffect(()=>{
  if(userApplications.length >0 && jobData)
    checkAlreadyApplied();
},[jobData,userApplications,id])

  const totalPages = Math.ceil(otherJobs.length / jobsPerPage);
  const paginatedJobs = otherJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return jobData ? (
    <>
      <Navbar />
      <div className='container min-h-screen flex flex-col py-10 px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>
          {/* Header */}
          <div className='flex justify-center md:justify-between flex-col lg:flex-row gap-8 px-14 py-10 sm:py-16 mb-6 bg-blue-50 border border-blue-600 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center max-md:items-start'>
              <img className='h-32 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' src={jobData.companyId.image} alt="" />
              <div className='md:text-left text-neutral-700'>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-medium'>{jobData.title}</h1>
                <div className='flex flex-col md:flex-row items-left md:items-center max-md:justify-center gap-y-2 gap-4 lg:gap-6 text-gray-600 mt-3'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt="" />
                    <p>{jobData.companyId.name}</p>
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt="" />
                    <p>{jobData.location}</p>
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt="" />
                    <p>{jobData.level}</p>
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.money_icon} alt="" />
                    <p>CTC: ${kconvert.convertTo(jobData.salary)}</p>
                  </span>
                </div>
              </div>
            </div>
            <div className='flex flex-col max-lg:flex-row max-md:flex-col gap-x-10 gap-y-3 justify-center max-lg:justify-start items-start max-lg:items-center max-md:items-start'>
              <button onClick={ApplyHandler}  className='font-medium text-lg bg-blue-500 text-white px-6 py-2 rounded-xl max-sm:text-sm max-sm:px-4'>{isAlreadyApplied?'Already applied':"Apply Now"}</button>
              <p className='max-sm:text-sm font-light relative left-1'>Posted {moment(jobData.date).fromNow()}</p>
            </div>
          </div>

          {/* Job Body */}
          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>Job description</h2>
              <div className='rich-text' dangerouslySetInnerHTML={{ __html: jobData.description }}></div>
              <button onClick={ApplyHandler}  className='font-medium text-lg bg-blue-500 text-white px-6 py-2 rounded-xl max-sm:text-sm max-sm:px-4 mt-10'>{isAlreadyApplied?'Already applied':"Apply Now"}</button>
            </div>

            {/* More jobs */}
            <div className='w-full lg:w-1/3 max-lg:mt-8 lg:ml-8 space-y-4' id='other-jobs'>
              <h2 className='font-medium text-gray-500'>
                More jobs from <span className='text-black text-lg'>{jobData.companyId.name}</span>
              </h2>

              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job, index) => <JobCard key={index} job={job} />)
              ) : (
                <p className='text-gray-500 text-sm'>No other jobs from this company.</p>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex items-center justify-center space-x-2 mt-10'>
                  {/* Left Arrow */}
                  <button
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    className={`p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentPage === 1}
                  >
                    <img src={assets.left_arrow_icon} alt="Previous" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded text-sm ${currentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  {/* Right Arrow */}
                  <button
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    className={`p-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentPage === totalPages}
                  >
                    <img src={assets.right_arrow_icon} alt="Next" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
}

export default ApplyJob;
