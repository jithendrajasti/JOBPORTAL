import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className=' container mx-auto flex w-full p-2 sm:p-5 items-center justify-between max-sm:flex-col gap-y-4'>
        <div className='flex  items-center gap-3 max-sm:flex-col'>
            <img className='h-8 sm:h-10 lg:h-12 ' src={assets.logo} alt="" />
            <p className='text-3xl font-extralight max-sm:hidden'>|</p>
            <p className='text-sm sm:text-lg text-gray-600 sm:ml-5'>All right reserved &copy;jobhub</p>
        </div>
        <div className='flex gap-5'>
            <a href="#"><img className='h-6 sm:h-8' src={assets.facebook_icon} alt="" /></a>
            <a href="#"><img className='h-6 sm:h-8' src={assets.twitter_icon} alt="" /></a>
            <a href="#"><img className='h-6 sm:h-8' src={assets.instagram_icon} alt="" /></a>            
        </div>
    </div>
  )
}

export default Footer