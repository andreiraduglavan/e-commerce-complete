import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {  db } from '../firebase/clientApp'
import { collection, getDocs } from "firebase/firestore"
import Link from 'next/link'

export default function Home({ banners, products }) {
  const [width, setWidth] = useState(0)

  const curry1 = 'https://firebasestorage.googleapis.com/v0/b/fir-ecommerce-backend.appspot.com/o/images%2Fcurry1.jpg?alt=media&token=8073272a-6e3b-4214-a602-f3969cb4cf8d'
  const curry2 = 'https://firebasestorage.googleapis.com/v0/b/fir-ecommerce-backend.appspot.com/o/images%2Fcurry2.jpg?alt=media&token=9ba3fed8-1e2d-4f2f-9b14-363629199fd5'
  const curry3 = 'https://firebasestorage.googleapis.com/v0/b/fir-ecommerce-backend.appspot.com/o/images%2Fcurry3.jpg?alt=media&token=35c81a0f-7f88-498f-9822-6432a0bba6e1'
  const curry4 = 'https://firebasestorage.googleapis.com/v0/b/fir-ecommerce-backend.appspot.com/o/images%2Fcurry4.jpg?alt=media&token=acf1325e-a285-4689-a974-9f460455998d'
  const curry5 = 'https://firebasestorage.googleapis.com/v0/b/fir-ecommerce-backend.appspot.com/o/images%2Fcurry5.jpg?alt=media&token=f423ce78-f866-4f0c-b405-aba14cd987e0'

  const carousel = useRef()

  useEffect(() => {
    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
  }, [])
  
  return (
    <div>
      <div className='relative' style={{color:banners[0].text_color}}>
        <img src={banners[0].image} alt='lebron' className='w-full h-[100vh] object-cover'/>
        <div className='top-[50vh] left-[6vw] absolute'>
          <h1 className='text-4xl my-8 uppercase'>{banners[0].title}</h1>
          <div className='w-96'>
            <p>{banners[0].text}</p>
          </div>
          <Link href={banners[0].link_to}>
            <button className='mt-6 absolute btn'>
              {banners[0].button_text}
            </button>
          </Link>
        </div>
      </div>
      
      <div>
        <div className='flex flex-col md:flex-row m-2 mt-12 md:mt-0'>
          <div className='flex flex-col items-center justify-center'>
            <div className='flex w-72 md:ml-20'>
              <button className=' bg-black text-white p-2 px-16 text-sm hover:opacity-80 transition duration-500 mt-4 relative'>
                <p className='text-xl absolute -top-7 left-0 text-black'>Ballers '22</p>
                SHOP NOW
              </button>
            </div>         
          </div>
          <motion.div ref={carousel} className='overflow-hidden mt-8 md:m-2'>
            <motion.div drag='x' dragConstraints={{ right: 0, left: -width}} className='flex md:ml-20 sm:w-auto w-full cursor-grab'>
              { products.map((product, index) => (
                <Link href={'/product/'+product.id} key={index}>
                <motion.div className='mx-2 hover:opacity-80 cursor-grab hover:cursor-pointer relative transition duration-500 min-w-max'>
                  <img src={product.images[0]} className='w-64 object-cover h-96'/>
                  <div className='opacity-0 hover:opacity-100 absolute m-2 inset-0 z-10 transition duration-500'>
                    <p className=''>{product.title}</p>
                    <button className='text-sm border-b-2 border-black'>SHOP NOW</button>
                  </div>
                </motion.div>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row'>
        { banners.filter((item, index) => index!==0).map((banner) => (
          <div className='md:w-1/2 relative hover:opacity-80 cursor-pointer transition duration-500' key={banner.id} style={{color:banner.text_color}}>
            <img src={banner.image} alt='lebron' className='w-full h-[100vh] object-cover'/>
            <div className='bottom-0 m-4 absolute'>
              <p className='uppercase'>{banner.title}</p>
              <button className='text-sm border-b-2 uppercase' style={{borderColor:banner.text_color}}>{banner.button_text}</button>
            </div>
          </div>
        ))}
      </div>

      <div className='m-8 md:mx-20 overflow-hidden'>
        <p className='mb-4 text-xs'>shop instagram</p>
        <div className='flex md:grid md:grid-flow-row md:grid-cols-4 md:grid-rows-2'>
          <div className='md:col-span-2 md:row-span-2 md:mx-0 mx-1 relative min-w-max md:min-w-fit hover:opacity-80 cursor-pointer transition duration-500'>
            <img src={curry1} alt='curry' className='md:w-full w-48 object-cover md:h-[36rem] h-48'/>
            <div className='opacity-0 hover:opacity-100 absolute inset-0 z-10 transition duration-500 flex justify-center items-center'>
                <p className='text-white'>shop the look</p>
            </div>
          </div>
          { [curry2, curry3, curry4, curry5].map((url, index) => (
            <div key={index} className='relative min-w-max md:mx-0 mx-1 md:min-w-fit hover:opacity-80 cursor-pointer transition duration-500'>
              <img src={url} alt='curry' className='md:w-full w-48 object-cover md:h-[18rem] h-48'/>
              <div className='opacity-0 hover:opacity-100 absolute inset-0 z-10 transition duration-500 flex justify-center items-center'>
                <p className='text-white'>shop the look</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export const getStaticProps = async () => {

  const productsCollectionRef = collection(db, 'products')
  const pdata = await getDocs(productsCollectionRef)
  const products = pdata.docs.map((doc)=> ({...doc.data(), id:doc.id}))

  const bannersCollectionRef = collection(db, 'banners')
  const bdata = await getDocs(bannersCollectionRef)
  const banners = bdata.docs.map((doc)=> ({...doc.data(), id:doc.id}))
    
  return {
    props: { banners, products }
  }
}