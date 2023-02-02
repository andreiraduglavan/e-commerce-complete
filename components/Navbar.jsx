import React, { useState } from 'react'
import logo from '../public/favicon.png'
import Image from 'next/image'
import Link from 'next/dist/client/link'
import { FaRegHeart } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi'
import { motion, useCycle, AnimatePresence } from 'framer-motion'
import { MenuToggle } from "./MenuToggle";
import { useStateContext } from '../context/StateContext'
import Cart from './Cart'
import { AiOutlineClose } from 'react-icons/ai'
import { getSearchURL } from '../utils/utils'
import { useRouter } from 'next/dist/client/router'

const Navbar = () => {
  const router = useRouter()

  const [isOpen, toggleOpen] = useCycle(false, true)
  const { setShowCart, cartQty} = useStateContext()
  const [showSearch, setShowSearch] = useState(false)
  const [searchInputValue, setSearchInputValue] = useState('')

  const textColor = router.pathname === '/' ? 'white' : 'black'

  return (
    <div>
      
      <AnimatePresence>
      {showSearch && <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-[100]'>
          <motion.div className='bg-white h-[20vh] flex justify-center items-center'
            initial={{y: '-100%', opacity:0}}
            animate={{y: 0, opacity:1}}
            exit={{ y: '-100%', opacity:0}}
            transition={{duration: 0.4, ease: 'easeIn'}}
          >
            <div className='flex'>
              <input type='text' placeholder='Search Anything' onChange={(e) => setSearchInputValue(e.target.value)} onKeyPress={ (e) => e.code==='Enter' && window.location.replace(getSearchURL(searchInputValue))} className='border-b-[1px] border-black outline-none w-72 p-2'/>
              <AiOutlineClose size={20} onClick={() => setShowSearch(false)} className='cursor-pointer m-2'/>
            </div>
          </motion.div>
        </div>
      }
      </AnimatePresence>
      
      <motion.nav className='top-0 z-50 fixed w-full flex flex-row bg-transparent' animate={isOpen ? 'open' : 'closed'}>
        <div className='hidden lg:flex items-center justify-start w-5/12 ml-8'>
          { ['New Arrivals', 'Shop'].map((item, index) => (
            <Link href={'/'+item.toLowerCase().replace(' ', '')} key={item.replace(' ', '')+index}>
              <li className='mx-4 cursor-pointer p-2 list-none' style={{color: textColor}}>{item.toUpperCase()}</li>
            </Link>
          ))}
        </div>
        <div className='lg:hidden w-5/12 flex justify-start p-6 text-white'>
          <div className='z-50'>
            <MenuToggle toggle={() => toggleOpen()} />
          </div>
        </div>
        { isOpen && 
          <div className='fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm'>
            <div className='flex flex-col items-center justify-center inset-0 min-h-screen'>
              { ['New Arrivals', 'Shop'].map((item, index) => (
                <Link href={'/'+item.toLowerCase().replace(' ', '')} key={item.replace(' ', '')+index} >
                  <motion.li 
                    className='mx-4 cursor-pointer p-2 list-none text-white'
                    animate={{translateY:-50}} 
                    transition={{duration:0.6}} 
                    initial={{opacity: 0}} 
                    whileInView={{opacity:1}}
                    >{item.toUpperCase()}</motion.li>
                </Link>
              ))}
            </div>
          </div>
        }
        { !isOpen && <div className='w-2/12 flex justify-center'>
          <Link href={'/'}>
            <div>
              <Image src={logo} alt='logo' width={56} height={63} className='cursor-pointer' />
            </div>
          </Link>
        </div>}
        <div className='hidden lg:flex items-center justify-end w-5/12 mr-8'>
          <li className='mx-4 cursor-pointer p-2 list-none' onClick={() => setShowSearch(true)} style={{color: textColor}}>SEARCH</li>
          { ['SIGN IN', 'heart'].map((item, index) => (
            <Link href={'/'+item.toLowerCase().replace(' ', '')} key={item.replace(' ', '')+index+'1'}>
              <li className='mx-4 cursor-pointer p-2 list-none' style={{color: textColor}}>{item!=='heart' ? item.toUpperCase() : <FaRegHeart size={19}/> }</li>
            </Link>
          ))}
          <li className='mx-4 cursor-pointer p-2 list-none' style={{color: textColor}} onClick={() => setShowCart(true)}>BAG ({cartQty})</li>
        </div>
        <div className='lg:hidden w-5/12 flex justify-end p-5 text-white'>
          <FaRegHeart size={28} className='mr-6'/>
          <FiShoppingCart size={28} onClick={() => setShowCart(true)}/>
        </div>

        <Cart />
      </motion.nav>
    </div>
  )
}

export default Navbar