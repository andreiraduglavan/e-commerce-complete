import {  db } from '../../firebase/clientApp'
import { collection, getDocs } from "firebase/firestore"
import { Products } from '../../components'

const productsCollectionRef = collection(db, 'products')

const product_manager = ({products}) => {
  
  return (
    <div className='w-full'>
      <Products products={products}/>
    </div>
  )
}



export const getStaticProps = async () => {
  
  const data = await getDocs(productsCollectionRef)
  const products = data.docs.map((doc)=> ({...doc.data(), id:doc.id}))
    
  return {
    props: {products }
  }
}

export default product_manager