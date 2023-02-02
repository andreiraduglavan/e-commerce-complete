import React from 'react'
import { db } from '../../firebase/clientApp'
import { collection, getDocs } from "firebase/firestore"

const Search = ({products, userQuery}) => {
  
  return (
    <div className='m-8 mt-24'>
      <h1 className='uppercase font-medium mb-8'>Search results for {userQuery}:</h1>
      <div className='grid grid-cols-4'>
        {products && products.map((item, index) => (
          <Link href={'http://localhost:3000/product/'+item.id} key={index}>
            <div className='mx-2 hover:opacity-80 hover:cursor-pointer relative transition duration-500 min-w-max'>
              <img src={item.images[0]} className='w-full object-cover h-[70vh]'/>
              <div className='opacity-0 hover:opacity-100 absolute m-2 inset-0 z-10 transition duration-500 flex  flex-col justify-end'>
                <p>{item.title}</p>
                <p className='font-medium'>USD ${item.quantity}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
 
export const  getServerSideProps = async ({params:{ userQuery }}) => {
  
  const queries = userQuery.split('+')

  const productsCollectionRef = collection(db, 'products')
  const data = await getDocs(productsCollectionRef)
  const allProducts = data.docs.map((doc)=> ({...doc.data(), id:doc.id}))
  const products = allProducts.filter((item) => {
    var check = false
    for (const query of queries) {
      if( item.title.toLowerCase().includes(query)) check = true
    }
    return (check)
  })
  
  return {
    props: {products, userQuery}
  }
}

export default Search