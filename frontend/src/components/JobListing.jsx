import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets';
import JobCard from './JobCard';

const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategories,setSelectedCategories]=useState([]);
    const [selectedLocations,setSelectedLocations]=useState([]);

    const [filteredJobs,setFilteredJobs]=useState(jobs);
    const handleCategoryChange=(category)=>{
        setSelectedCategories(prev=>prev.includes(category)?prev.filter(cat=>cat!==category):[...prev,category]);
    }
    const handleLocationChange=(location)=>{
        setSelectedLocations(prev=>prev.includes(location)?prev.filter(loc=>loc!==location):[...prev,location]);
    }
    useEffect(()=>{
         const matchesCategory=job=>selectedCategories.length===0 ||selectedCategories.includes(job.category);
         const matchesLocation=job=>selectedLocations.length===0 || selectedLocations.includes(job.location);
         const matchesTitle=job=>searchFilter.title==='' || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
         const matchesSearchLocation=job=>searchFilter.location==='' || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

         const newFilteredJobs=jobs.slice().reverse().filter(
            job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
         );
         setFilteredJobs(newFilteredJobs);
         setCurrentPage(1);
    },[jobs,selectedCategories,selectedLocations,searchFilter])
    return (
        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
            {/* Sidebar */}
            <div className='w-full lg:w-1/4 bg-white px-4'>
                {/* searchFilter from hero component */}
                {isSearched
                    && (searchFilter.title !== '' || searchFilter.location !== '')
                    && (
                        <>
                            <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                            <div className='flex mb-4 text-gray-600 items-center gap-2'>
                                {searchFilter.title && (
                                    <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-lg shadow-md'>
                                        {searchFilter.title}
                                        <img className='h-2 sm:h-2.5 cursor-pointer' onClick={e => setSearchFilter(prev => ({ ...prev, title: '' }))} src={assets.cross_icon} alt="" />
                                    </span>
                                )}
                                {searchFilter.location && (
                                    <span className='inline-flex items-center gap-2.5 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-lg shadow-md'>
                                        {searchFilter.location}
                                        <img className='h-2 sm:h-2.5 cursor-pointer' onClick={e => setSearchFilter(prev => ({ ...prev, location: '' }))} src={assets.cross_icon} alt="" />
                                    </span>
                                )}
                            </div>
                        </>
                    )
                }
                <button onClick={e => setShowFilter(prev => !prev)} className='px-6 py-1.5 rounded border font-medium text-lg border-gray-400 lg:hidden'>
                    {showFilter ? "Close" : "Filters"}
                </button>
                {/* category filter */}
                <div className={showFilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4'>Search by categories</h4>
                    <ul className='space-y-3 text-gray-600'>
                        {
                            JobCategories.map((category, index) => {
                                return <li className='flex gap-3 items-center' key={index}>
                                    <input onChange={()=>handleCategoryChange(category)} className='scale-125' type="checkbox" checked={selectedCategories.includes(category)} />
                                    {category}
                                </li>
                            })
                        }
                    </ul>
                </div>
                {/* location filter */}
                <div className={showFilter ? "" : "max-lg:hidden lg:mt-8"}>
                    <h4 className='font-medium text-lg py-4'>Search by location</h4>
                    <ul className='space-y-3 text-gray-600'>
                        {
                            JobLocations.map((location, index) => {
                                return <li className='flex gap-3 items-center' key={index}>
                                    <input onChange={()=>handleLocationChange(location)} className='scale-125' type="checkbox" checked={selectedLocations.includes(location)}  />
                                    {location}
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
            {/* Job listings */}
            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4 '>
                <h3 className='font-medium text-3xl py-2 ml-5' id='job-list'>Latest jobs</h3>
                <p className='mb-8 ml-5'>Get your desired job from top companies</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {
                        filteredJobs.slice((currentPage-1)*6,(currentPage)*6).map((job, index) => {
                            return <JobCard key={index} job={job} />
                        })
                    }
                </div>
                {/* pagination */}
                {jobs.length > 0 && (
                    <div className='flex items-center justify-center space-x-2 mt-10'>
                        <a onClick={()=>setCurrentPage(Math.max(currentPage-1,1))} href="#job-list">
                            <img src={assets.left_arrow_icon} alt="" />
                        </a>
                        {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => {
                                  return <a href="#job-list" key={index}>
                                    <button onClick={()=>setCurrentPage(index+1)} className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage===index+1 ? 'bg-blue-100 text-blue-500':'text-gray-500'}`}>{index+1}</button>
                                  </a>
                        })}
                        <a  href="#job-list">
                            <img onClick={()=>setCurrentPage(Math.min(currentPage+1,Math.ceil(filteredJobs.length/6)))} src={assets.right_arrow_icon} alt="" />
                        </a>
                    </div>
                )}
            </section>
        </div>
    )
}

export default JobListing