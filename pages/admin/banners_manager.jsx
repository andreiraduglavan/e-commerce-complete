import {  db } from '../../firebase/clientApp'
import { collection, getDocs } from "firebase/firestore"
import { PublishBanner } from '../../components'
import { useStateContext } from '../../context/StateContext'

const bannersCollectionRef = collection(db, 'banners')

const BannersManager = ({ banners }) => {
  const { currentBanner, setCurrentBanner, setIsNewBanner } = useStateContext()

  return (
    <div className="flex">
      <div className="w-2/5 flex flex-col mx-6">
      <h1 className='m-2 my-6 text-3xl font-medium'>Banners Manager</h1>
        { banners.map((banner, index) => (
          <button onClick={() => { setIsNewBanner(false), setCurrentBanner(banner)}} key={banner.title+index}>
            <div className='bg-white rounded-lg flex flex-row p-2 m-2 hover:shadow-lg hover:opacity-90 backdrop-blur-2xl shadow-md'>
              <img src={banner.image} className='h-8' />
              <p className="pt-2 pl-2">{banner.title.length<16 ? banner.title : banner.title.slice(0, 17)+'...'}</p>
            </div>
          </button>
        ))}
        <button onClick={() => { setIsNewBanner(true); setCurrentBanner({}) }}>
            <div className='bg-slate-200 rounded-lg flex flex-row p-2 m-2 hover:shadow-lg hover:opacity-90 backdrop-blur-2xl shadow-md'>
              <p className="pt-2 pl-2">+ Add new banner</p>
            </div>
          </button>
      </div>
      <div className='min-h-screen border-l-[1px] border-dashed border-l-slate-200'></div>
      <div className="w-3/5 mx-6">
        {
          currentBanner
          ? <PublishBanner /> :
            <p className='my-4'>select a product</p>
        }
        
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  
  const data = await getDocs(bannersCollectionRef)
  const banners = data.docs.map((doc)=> ({...doc.data(), id:doc.id}))
    
  return {
    props: { banners }
  }
}

export default BannersManager