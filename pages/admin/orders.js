import React from 'react'
import {  db } from '../../firebase/clientApp'
import { collection, getDocs } from "firebase/firestore"


const Orders = ({ orders }) => {
  console.log(orders)
  var today = new Date();
  var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()

  const Products = ({order}) => {
    return (
      order.products.data.map((product, index) => (
        <div className='bg-dashboard-main text-white rounded-lg flex flex-row p-2 m-2 backdrop-blur-2xl shadow-md' key={index}>
          <div className='flex justify-between w-11/12 p-2'>
            <p>{product.description}</p>
            <p>Quantity: {product.quantity}</p>
          </div>
        </div>
      ))
    )
  }

  return (
    <div>
      <div className="w-3/5 flex flex-col mx-6">
      <h1 className='m-2 my-6 text-3xl font-medium'>Orders</h1>
        <div className='flex justify-between w-11/12 p-4 font-medium'>
          <p>Customer</p>
          <p>Date</p>
          <p>Status</p>
        </div>
        { orders.map((order, index) => (
          <div key={index} className='relative'>
            <input type='checkbox' className='absolute top-0 inset-x-0 opacity-0 z-10 peer h-16 cursor-pointer'/>
            <button className='w-full'>
              <div className='bg-white rounded-lg flex flex-row p-2 m-2 hover:shadow-lg hover:opacity-90 backdrop-blur-2xl shadow-md'>
                <div className='flex justify-between w-11/12 p-2'>
                  <p>{order.customer_details.name}</p>
                  <p>{date}</p>
                  <p>status</p>
                </div>
              </div>
            </button>
            <div className='text-sm text-slate-800 overflow-hidden max-h-0 peer-checked:max-h-72 transition-all duration-500 mx-4'>
              <p>{order.customer_details.name}</p>
              <p>email: {order.customer_details.email}</p>
              <p>phone: {order.customer_details.phone}</p>
              <p>{order.customer_details.address.city}, {order.customer_details.address.country}</p>
              <p>{order.customer_details.address.line1}</p>
              <p>{order.customer_details.address.line2}</p>
              <br/>
              <p>Products ordered: </p>
              <Products order={order} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const getStaticProps = async () => {

  const ordersCollectionRef = collection(db, 'orders')
  const data = await getDocs(ordersCollectionRef)
  const orders = data.docs.map((doc)=> ({...doc.data(), id:doc.id}))
    
  return {
    props: { orders }
  }
}

export default Orders