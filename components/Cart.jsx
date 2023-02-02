import React from 'react'
import { useStateContext } from '../context/StateContext'
import { AnimatePresence, motion } from 'framer-motion'
import { AiOutlineClose } from 'react-icons/ai'
import  getStripe  from '../lib/getStripe'

const Cart = () => {
  const { showCart, setShowCart, cartItems, removeItem } = useStateContext()

  const handleCheckout = async () => {
    const stripe = await getStripe()

    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cartItems)
    })

    if (response.statusCode ===500) return

    const data = await response.json()

    stripe.redirectToCheckout({sessionId: data.id})
  }

  return (
    <AnimatePresence >
      { showCart && <motion.div 
        className='fixed w-[400px] h-screen bg-white border-l-2 rounded-l-xl top-0 right-0' 
        initial={{x: '100%', opacity:0}}
        animate={{x: 0, opacity:1}}
        exit={{ x: '100%', opacity:0}}
        transition={{duration: 0.5, ease: 'easeIn'}}
      >
        <div className='flex justify-between m-2 my-4'>
          <div className=''>
            <h1 className='text-lg'>SUBTOTAL: USD $0</h1>
          </div>
          <div className='my-1 m-2 cursor-pointer'>
            <AiOutlineClose size={20} onClick={() => setShowCart(false)}/>
          </div>
        </div>
        <div className='m-2'>
          <button className='bg-black text-white p-2 px-8 hover:opacity-80' onClick={handleCheckout} >
            Go to Checkout
          </button>
        </div>
        <div className='mb-2 flex flex-col h-[80vh] overflow-scroll cart-product-wrapper'>
          { cartItems.map((item, index) => (
            <div className='m-2 relative' key={index}>
              <img src={item.images[0]} alt='product image' className='w-full object-cover h-72'/>
              <button 
                className='absolute top-0 right-0 p-2 text-[12px] flex'
                onClick={() => removeItem(item)}
              ><AiOutlineClose size={12} className='my-[3px] mx-[1px]'/>REMOVE</button>
              <div className='absolute bottom-0 left-0 p-2'>
                <h2>{item.title}</h2>
                <h2>Quantity: {item.userQty}</h2>
              </div>
            </div>
          ))}
        </div>
      </motion.div>}
    </AnimatePresence>
  )
}

export default Cart