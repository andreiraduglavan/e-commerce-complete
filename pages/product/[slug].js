import React from 'react'
import { doc, getDoc} from "firebase/firestore"
import {  db } from '../../firebase/clientApp'
import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { images } from '../../constants'
import { useStateContext } from '../../context/StateContext'
import { motion } from 'framer-motion'

const Product = ({product}) => {
  const [currentImage, setCurrentImage] = useState(0)
  const randomIndex = Math.floor(Math.random() * 6)
  const { addItem } = useStateContext()

  const ref = useRef()
  const [titleWidth, setTitleWidth] = useState('0px')
  useLayoutEffect (() => {
    setTitleWidth(ref.current.offsetWidth+'px')
  }, [])
  

  return (
    <div className='flex min-h-screen relative flex-col lg:flex-row'>
      <div className='lg:w-1/2 relative'>
        <img src={product.images[currentImage]} alt='lebron' className='w-full lg:h-[100vh] h-[80vh] object-cover'/>
        <div className='absolute lg:bottom-[10vh] bottom-[5vh] flex justify-center w-full'>
            { product.images.map((url, index) => (
              <div className='mx-2 cursor-pointer' key={url+index} onMouseEnter={() => setCurrentImage(index)}>
                <img src={url} alt='lebron' className='object-cover w-16 h-16 hover:opacity-90 rounded-lg'/> 
              </div>
            ))}
        </div>
      </div>
      
      <div className='hidden lg:block absolute top-[20vh] w-full'>
        <div className='flex justify-center'>
          <h1 className='relative text-6xl z-50 uppercase' ref={ref}>{product.title}</h1>
          <motion.div 
            initial={{scaleX: 0, opacity:0}}
            animate={{scaleX: 1, opacity:1}}
            transition={{duration: 1, ease: 'easeIn'}}
            className='absolute top-[30px] h-6 bg-[#8810a7] opacity-80' 
            style={{width: titleWidth}}></motion.div>
        </div>
      </div>

      <div className='hidden w-1/2 lg:flex justify-center items-center relative'>
        <motion.div
          initial={{x: '100%', opacity:0}}
          animate={{x: 0, opacity:1}}
          transition={{duration: 1, ease: 'easeIn'}}
        >
          <Image src={images[randomIndex]} alt='caricature' width={288} height={288} className='opacity-50'/>
        </motion.div>

        <motion.div 
          className='absolute w-[30vw]'
          initial={{x: '100%', opacity:0}}
          animate={{x: 0, opacity:1}}
          transition={{duration: 1, ease: 'easeIn'}}
        >
          <p>{product.description}</p>
          <div className='flex flex-row mt-8'>
            <p className='mr-6 p-2 text-lg'>${product.quantity} + Free Shipping</p>
            <button className='bg-black text-white p-2 px-16 text-sm hover:opacity-80 transition duration-500' onClick={ () => addItem(product)}>
              Add to cart
            </button>
          </div>        
        </motion.div>      
      </div>

      <div className='flex flex-col lg:hidden m-8'>
        <span className='text-gray-400 text-sm uppercase mb-2'>new arrivals</span>
        <h1 className='uppercase text-2xl mb-2'>{product.title}</h1>
        <div className='flex flex-col justify-center'>
          <p className='text-sm mb-4 font-medium'>${product.quantity} + Free Shipping</p>
          <p className='text-sm mb-4 font-medium'>{product.description}</p>
          <button className='bg-black text-white p-2 px-16 text-sm hover:opacity-80 transition duration-500' onClick={ () => addItem(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

export const  getServerSideProps = async ({params:{ slug }}) => {
  
  const docRef = doc(db, 'products', slug)
  const docSnap = await getDoc(docRef)
  const product = {...docSnap.data(), id:docSnap.id}
  
  return {
    props: {product}
  }
}


export default Product