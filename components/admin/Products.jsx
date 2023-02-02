import { useStateContext } from '../../context/StateContext'
import PublishProduct from './PublishProduct'

const Products = ({products}) => {
  
  const { currentProduct, setCurrentProduct, setIsNew } = useStateContext()
  
  return (
    <div className='flex'> 
      <div className="w-2/5 flex flex-col mx-6">
      <h1 className='m-2 my-6 text-3xl font-medium'>Products Manager</h1>
        { products.map((product, index) => (
          <button onClick={() => { setIsNew(false), setCurrentProduct(product)}} key={product.title+index}>
            <div className='bg-white rounded-lg flex flex-row p-2 m-2 hover:shadow-lg hover:opacity-90 backdrop-blur-2xl shadow-md'>
              <img src={product.images[0]} className='h-8' />
              <p className="pt-2 pl-2">{product.title.length<16 ? product.title : product.title.slice(0, 17)+'...'}</p>
            </div>
          </button>
        ))}
        <button onClick={() => { setIsNew(true); setCurrentProduct({}) }}>
            <div className='bg-slate-200 rounded-lg flex flex-row p-2 m-2 hover:shadow-lg hover:opacity-90 backdrop-blur-2xl shadow-md'>
              <p className="pt-2 pl-2">+ Add new product</p>
            </div>
          </button>
      </div>
      <div className='min-h-screen border-l-[1px] border-dashed border-l-slate-200'></div>
      <div className="w-3/5 mx-6">
        {
          currentProduct
          ? <PublishProduct /> :
            <p className='my-4'>select a product</p>
        }
        
      </div>
    </div>
  )
}

export default Products