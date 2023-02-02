import React from 'react'
import logo from '../../public/logo_transparent-removebg-preview.png'
import Image from 'next/image'
import Link from 'next/dist/client/link'
import { BsPerson, BsImageAlt, BsFillBagCheckFill } from 'react-icons/bs'
import { MdIncompleteCircle, MdAnalytics } from 'react-icons/md'
import { ImTruck } from 'react-icons/im'
import { useRouter } from 'next/dist/client/router'

const AdminNavbar = () => {
  const router = useRouter()
  const navbarColor = (name) => {
    if (router.pathname.includes(name)) {
      return '#6460f2'
    }
    else return 'transparent'
  }

  const textColor = (name) => {
    if (router.pathname.includes(name)) {
      return '#ffffff'
    }
    else return 'black'
  }

  return (
    <div className='w-[360px] bg-[#f7f8fc] rounded-r-3xl min-h-screen'>
      <div className='m-4'>
        <Image src={logo} alt="logo"/>
      </div>
      <div className='flex m-4 bg-white rounded-3xl mb-8'>
        <BsPerson size={28} className='m-4 my-6' />
        <div className='flex flex-col m-4 mx-0'>
          <p className='font-semibold text-dashboard-main'>Name</p>
          <p className='text-slate-400 text-sm'>Pro Member</p>
        </div>
      </div>
      <Link href='/admin/dashboard'>
      <div className='flex m-2  rounded-3xl  my-4 cursor-pointer' style={{backgroundColor: navbarColor('/dashboard'), color:textColor('/dashboard')}}>
        <MdIncompleteCircle size={28} className="mx-6 my-2"/>
        <p className='mt-3 font-medium'>Dashboard</p>
      </div>
      </Link>
      <Link href='/admin/product_manager'>
      <div className='flex m-2  rounded-3xl my-4 cursor-pointer' style={{backgroundColor: navbarColor('product_manager'), color:textColor('product_manager')}}>
        <BsFillBagCheckFill size={28} className="mx-6 my-2"/>
        <p className='mt-3 font-medium'>Products</p>
      </div>
      </Link>
      <Link href='/admin/banners_manager'>
      <div className='flex m-2  rounded-3xl  my-4 cursor-pointer' style={{backgroundColor: navbarColor('banners_manager'), color:textColor('banners_manager')}}>
        <BsImageAlt size={28} className="mx-6 my-2"/>
        <p className='mt-3 font-medium'>Banners</p>
      </div>
      </Link>
      <Link href='/admin/orders'>
      <div className='flex m-2  rounded-3xl  my-4 cursor-pointer' style={{backgroundColor: navbarColor('orders'), color:textColor('orders')}}>
        <ImTruck size={28} className="mx-6 my-2"/>
        <p className='mt-3 font-medium'>Orders</p>
      </div>
      </Link>
      <Link href='/admin'>
      <div className='flex m-2  rounded-3xl  my-4 cursor-pointer' style={{backgroundColor: navbarColor('lala'), color:textColor('lala')}}>
        <MdAnalytics size={28} className="mx-6 my-2"/>
        <p className='mt-3 font-medium'>Analytics</p>
      </div>
      </Link>
    </div>
  )
}

export default AdminNavbar