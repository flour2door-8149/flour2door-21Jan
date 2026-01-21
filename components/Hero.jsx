'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

    return (
        <div className='w-full bg-[#F7F3E9]'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto py-10 px-6' >
                <div className='relative flex-1 flex flex-col bg-[#9bb585] rounded-3xl xl:min-h-100 group'>
                    <div className='p-5 sm:p-16'>
                        <div className='inline-flex items-center gap-3 bg-[#DDECCD] text-[#3C6E47] pr-4 p-1 rounded-full text-xs sm:text-sm'>
                            <span className='bg-[#3C6E47] px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>NEWS</span> Premium quality Organic Flour <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium text-[#4F3E2F] max-w-xs  sm:max-w-md'>
                            Fresh flour delivered to your Door.
                        </h2>
                        
                        <button className='bg-[#1C4028] text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition'>SHOP NOW</button>
                    </div>
                    <Image className='sm:absolute bottom-0 right-0 md:right-10 w-75 sm:max-w-sm px-10 py-6 ' src={assets.hero_model_img} alt="" />
                </div>
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-[#4F3E2F]'>
                    <div className='flex-1 flex items-center justify-between w-full bg-[#cfac84] rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium text-[#4F3E2F] max-w-40'>Premium FLours</p>
                            <p className='flex items-center gap-1 mt-4 text-[#3C6E47]'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img1} alt="" />
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-[#b2c5a2] rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium text-[#4F3E2F] max-w-40'>Sustainable & Organic</p>
                            <p className='flex items-center gap-1 mt-4 text-[#3C6E47]'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img2} alt="" />
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero