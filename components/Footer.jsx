import React from 'react'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'

const Footer = () => {

  return (
    <div className='flex lg:flex-row flex-col lg:justify-between m-8 mt-16 mr-32 lg:w-auto w-[90%]'>
      <div className='flex flex-col relative mb-2 lg:mb-0'>
        <input type="checkbox" 
          className="absolute top-0 inset-x-0 lg:hidden opacity-0 z-10 cursor-pointer peer h-6"
        />
        <p className='lg:mb-8 mb-2'>CUSTOMER CARE</p>
        <div className="absolute top-0 transition transform duration-500 rotate-0 peer-checked:rotate-180 lg:hidden left-[95%]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className='overflow-hidden max-h-0 peer-checked:max-h-40 lg:max-h-max flex flex-col transition-all duration-500'>
          { ['contact', 'shipping & delivery', 'returns', 'faq', 'flash sale terms'].map((item, index) => (
            <button className='text-sm uppercase text-left mb-[2px]' key={item+index}>{item}</button>
          ))}
        </div>
      </div>
      <div className='flex flex-col relative mb-2 lg:mb-0'>
        <p className='lg:mb-8 mb-2'>INFO</p>
        <input type="checkbox" 
          className="absolute top-0 inset-x-0 w-full opacity-0 z-10 cursor-pointer peer lg:hidden h-6"
        />
        <div className="absolute top-0 left-[95%] transition-transform duration-500 rotate-0 peer-checked:rotate-180 lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className='overflow-hidden max-h-0 peer-checked:max-h-40 flex flex-col lg:max-h-max transition-all duration-500'>
          { ['stores' ,'size guide', 'stockists', 'privacy policy', 'terms & conditions'].map((item, index) => (
            <button className='text-sm uppercase text-left mb-[2px]' key={item+index}>{item}</button>
          ))}
        </div>
      </div>
      <div className='flex flex-col relative mb-6 lg:mb-0'>
        <p className='lg:mb-8 mb-2'>FOLOW US</p>
        <input type="checkbox" 
          className="absolute top-0 inset-x-0 w-full opacity-0 z-10 cursor-pointer peer lg:hidden h-6"
        />
        <div className="absolute top-0 left-[95%] transition-transform duration-500 rotate-0 peer-checked:rotate-180 lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className='overflow-hidden max-h-0 peer-checked:max-h-40 flex flex-col lg:max-h-max transition-all duration-500'>
          { ['facebook', 'instagram'].map((item, index) => (
            <button className='text-sm uppercase text-left mb-[2px] flex' key={item+index}>
              { item==='facebook' ? <FaFacebookF className='pt-[2px]' size={19}/> : <FaInstagram className='pt-[2px]' size={19}/>}
              <p className='ml-2'>{item}</p>
            </button>
          ))}
        </div>
      </div>
      <div className='text-xs'>
        <p className='mb-2'>We are located in Bucharest, Romania</p>
        <span>
          <p>Customer care hours:</p>
          <p className='mb-2'>Mon-Fri | 10am - 16pm UTC</p>
        </span> 
        <span className='mb-2'>
          <p>customercare@shop.com</p>
          <p>+40 770 123 456</p>
        </span>
      </div>
    </div>
  )
}

export default Footer