import React from 'react'
import { assets } from '../assets/assets'

const AppDownload = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto my-20'>
        <div className='relative bg-gradient-to-r from-violet-50 to-purple-50 rounded-3xl p-12 sm:p-24 flex flex-wrap '>
            <div >
                <h3 className='text-2xl sm:text-3xl font-bold mb-8 max-w-md'>Download Mobile App For Better Experience</h3>
                <div className='flex gap-4 items-center'>
                    <a href="#" className='inline-block'><img className='h-8 lg:h-12' src={assets.play_store} alt="" /></a>
                    <a href="#" className='inline-block'><img className='h-8 lg:h-12' src={assets.app_store} alt="" /></a>
                </div>
            </div>
            <img className='absolute sm:w-52 max-sm:hidden lg:w-72 sm:right-8 lg:right-52 bottom-0' src={assets.app_main_img} alt="" />
        </div>
    </div>
  )
}

export default AppDownload