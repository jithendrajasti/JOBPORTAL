import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value
    });
    setIsSearched(true);
  }
  return (
    <div className='container 2xl:px-20 mx-auto my-10'>
      <div className='bg-gradient-to-r from-purple-800 to bg-purple-950 text-white mx-2 py-16 rounded-xl px-20 flex flex-col items-center mb-6'>
        <h2 className='text-center text-lg sm:text-xl md:text-3xl lg:text-4xl font-medium mb-4'>Over 10,000+ to apply</h2>
        <p className='mb-8 max-w-xl mx-auto text-xs sm:text-sm font-light px-5 lg:text-lg text-center'>Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the First Step Toward Your Future!</p>
        <div className='flex items-center justify-between bg-white text-gray-600 sm:max-w-xl px-4 py-1 sm:py-0.5 mx-1 sm:mx-auto rounded-lg flex-col sm:flex-row max-w-40'>
          <div className='flex items-center'>
            <img src={assets.search_icon} alt="" className='h-4 lg:h-5' />
            <input type="text" placeholder='Search for jobs' className='max-sm:text-xs p-2 rounded outline-none w-full' ref={titleRef} />
          </div>
          <div className='flex items-center'>
            <img src={assets.location_icon} alt="" className='h-4 lg:h-5' />
            <input type="text" placeholder='Location' className='max-sm:text-xs p-2 rounded outline-none w-full' ref={locationRef} />
          </div>
          <button className=' text-xs sm:text-sm bg-indigo-500 text-white font-normal py-1 px-2 rounded-md' onClick={onSearch}>Search</button>
        </div>
      </div>
      <div className='flex items-center gap-x-10 gap-y-5 border border-orange-400 py-5 px-3 mx-4 flex-wrap rounded-lg shadow-lg flex-col xl:flex-row'>
        <p className='font-bold text-sm sm:text-[1.05rem]'>Trusted by</p>
        <div className='grid max-xl:grid-cols-3 xl:grid-cols-6 gap-5'>
          <img src={assets.microsoft_logo} alt="" className='h-6 sm:h-8' />
          <img src={assets.adobe_logo} alt="" className='h-6 sm:h-8' />
          <img src={assets.amazon_logo} alt="" className='h-6 sm:h-8' />
          <img src={assets.accenture_logo} alt="" className='h-6 sm:h-8' />
          <img src={assets.walmart_logo} alt="" className='h-6 sm:h-8' />
          <img src={assets.samsung_logo} alt="" className='h-6 sm:h-8' />
        </div>
      </div>
    </div>
  )
}

export default Hero