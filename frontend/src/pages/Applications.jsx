import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets';
import Footer from '../components/Footer';

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] mx-auto my-10'>
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {isEdit ?
            <>
              <label className='flex items-center gap-2' htmlFor="resume-upload">
                <p className='bg-blue-100 text-blue-600 px-4 py-1.5 rounded-md'>Select Resume</p>
                <input id='resume-upload' onChange={(e) => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden />
                <img src={assets.profile_upload_icon} alt="" />
                <button onClick={() => setIsEdit(false)} className='bg-green-100 border border-green-400 px-4 py-1.5 rounded-md m'>Save</button>
              </label>
            </> :
            <div className='flex gap-2'>
              <a className='bg-blue-100 text-blue-600 px-4 py-1.5 rounded-lg' href="">Resume</a>
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
                jobsApplied.map((job, index) => true ? (
                  <tr className='align-middle' key={index}>
                    <td className='py-1.5 px-4 border-b max-sm:text-sm'>
                      <div className='flex items-center gap-2 '>
                        <img className='w-8 h-8' src={job.logo} alt="" />
                        {job.company}
                      </div>
                    </td>
                    <td className=' py-1.5 px-4 border-b max-sm:text-sm'>{job.title}</td>
                    <td className='max-sm:hidden py-1.5 px-4 border-b max-sm:text-sm'>{job.location}</td>
                    <td className='max-sm:hidden py-1.5 px-4 border-b max-sm:text-sm'>{job.date}</td>
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