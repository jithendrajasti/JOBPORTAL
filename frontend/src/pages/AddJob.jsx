import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill';
import { JobCategories, JobLocations } from '../assets/assets';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
const AddJob = () => {
    const {backendUrl,companyToken,fetchJobs}=useContext(AppContext)
    const [title,setTiltle]=useState('');
    const [location,setLocation]=useState('Banglore');
    const [category,setCategory]=useState('Programming');
    const [level,setLevel]=useState('Beginner level');
    const [salary,setSalary]=useState(0);
    const editorRef=useRef(null)
    const quillRef=useRef(null);


    const onSubmitHandler=async(e)=>{
              e.preventDefault();

              try {
                
                const description=quillRef.current.root.innerHTML;

                const {data}=await axios.post(backendUrl+'/api/company/post-job',{title,description,category,location,level,salary},{headers:{token:companyToken}});

                if(data.success){
                    toast.success(data.message);
                    setTiltle('');
                    setSalary(0);
                    quillRef.current.root.innerHTML=''; 
                    fetchJobs();
                }
                else{
                    toast.error(data.message);
                }

              } catch (error) {
                toast.error(error.message);
              }

    }      


    useEffect(()=>{
         //Initiates quill package when comp mounted
         if(!quillRef.current && editorRef.current){
            quillRef.current=new Quill(editorRef.current,{
                theme:'snow'
            })
         }
    },[])
  return (
    <div>
         <form onSubmit={onSubmitHandler} className=' container p-4 flex flex-col w-full items-start gap-3'>
            <div className='w-full'>
                <p className='mb-2'>Job title</p>
            <input className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded-lg outline-none' type="text" placeholder='Type here' onChange={e=>setTiltle(e.target.value)} value={title} required/>
            </div>
            <div className='w-full max-w-lg'>
                <p className='my-2'>Job description</p>
                <div ref={editorRef}>

                </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 '>
                <div >
                    <p className='mb-2'>Job category</p>
                    <select  className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg' onChange={e=>setCategory(e.target.value)} >
                        {JobCategories.map((category,index)=>{
                              return <option key={index} value={category}>{category}</option>
                        })}
                    </select>
                </div>
                <div >
                    <p className='mb-2'>Job location</p>
                    <select  className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg' onChange={e=>setLocation(e.target.value)} >
                        {JobLocations.map((location,index)=>{
                              return <option key={index} value={location}>{location}</option>
                        })}
                    </select>
                </div>
                <div >
                    <p className='mb-2'>Job level</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg'  onChange={e=>setLevel(e.target.value)} >
                        <option value="Beginner level">Beginner level</option>
                        <option value="Intermediate level">Intermediate level</option>
                        <option value="Senior level">Senior level</option>
                    </select>
                </div>
            </div>
            <div>
                <p className='mb-2'>Job Salary</p>
                <input min={0} className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg sm:w-[120px]' onChange={e=>setSalary(e.target.value)} type="number" placeholder='2500' value={salary}/>
            </div>
            <button className='w-28 py-3 mt-4 bg-black/80 text-white rounded-lg text-sm'>ADD</button>
         </form>
    </div>
  )
}

export default AddJob