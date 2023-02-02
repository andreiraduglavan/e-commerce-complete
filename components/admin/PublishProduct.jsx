import {  db, storage } from '../../firebase/clientApp'
import { useState, useEffect } from "react"
import { collection, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { AiOutlineClose, AiOutlineDelete } from 'react-icons/ai'
import { TiDocument } from 'react-icons/ti'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { v4 } from 'uuid'
import { useStateContext } from '../../context/StateContext'
import { getPath } from '../../utils/utils' 

const PublishProduct = () => {
  
  const productsCollectionRef = collection(db, 'products')
  const { currentProduct, isNew, setCurrentProduct } = useStateContext()

  const [title, setTitle] = useState(isNew ? "" : currentProduct.title)
  const [description, setDescription] = useState(isNew ? "" : currentProduct.description)
  const [oldImages, setOldImages] = useState(isNew ? [] : currentProduct.images)
  const [brandDescription, setBrandDescription] = useState(isNew ? "" : currentProduct.brand_description)
  const [category, setCategory] = useState(isNew ? "" : currentProduct.category)
  const [materials, setMaterials] = useState(isNew ? "" : currentProduct.materials)
  const [quantity, setQuantity] = useState(isNew ? 0 : currentProduct.quantity)
  const [tags, setTags] = useState(isNew ? [] : currentProduct.tags)
  const [newImages, setNewImages] = useState([])
  const [imagesToBeDeleted, setImagesToBeDeleted] = useState([])
  
  const [modal, setModal] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTitle(isNew ? "" : currentProduct.title)
    setDescription(isNew ? "" : currentProduct.description)
    setOldImages(isNew ? [] : currentProduct.images)
    setBrandDescription(isNew ? "" : currentProduct.brand_description)
    setCategory(isNew ? "" : currentProduct.category)
    setTags(isNew ? [] : currentProduct.tags)
    setMaterials(isNew ? "" : currentProduct.materials)
    setQuantity(isNew ? 0 : currentProduct.quantity)
    setNewImages([])
    setImagesToBeDeleted([])

  }, [currentProduct, isNew])
  
  const uploadImage = (imageUpload) => {
    var p =  new Promise(function (resolve, reject) {
      const imageRef = ref(storage, `images/${imageUpload.name+v4()}`)

      const uploadTask = uploadBytesResumable(imageRef, imageUpload);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          console.log(error)
        }, 
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          });
        }
      )
    })

    return p
  }

  const deleteImage = (imageToBeDeleted) => {
    var p = new Promise( function(resolve, reject) {
      const imageRef = ref(storage, getPath(imageToBeDeleted))

      deleteObject(imageRef
        ).then(() => {
        resolve('ok')
     })
    })

    return p
  }

  const handlePublish = async () => {
    if(isNew) {
      setLoading(true)
    
      let imagesURLs = []
      for await (const image of newImages) {
        await uploadImage(image).then((result) => imagesURLs.push(result))
      }
      
      await addDoc(productsCollectionRef, { brand_description:brandDescription, category:category, description:description, images:imagesURLs, materials:materials, quantity:quantity, tags:tags, title:title })

      setLoading(false)
      setCurrentProduct(null)
    }

    else {
      setLoading(true)

      for await (const image of imagesToBeDeleted) {
        await deleteImage(image)
      }

      let imagesURLs = []
      for await (const image of newImages) {
        await uploadImage(image).then((result) => imagesURLs.push(result))
      }

      imagesURLs = imagesURLs.concat(oldImages)

      const productDoc = doc(db, 'products', currentProduct.id)
      const newFields = { brand_description:brandDescription, category:category, description:description, images:imagesURLs, materials:materials, quantity:quantity, tags:tags, title:title }
      await updateDoc(productDoc, newFields)

      setLoading(false)
      setCurrentProduct(null)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    
    for await (const image of oldImages) {
      await deleteImage(image)
    }
    
    const productDoc = doc(db, 'products', currentProduct.id)
    await deleteDoc(productDoc)

    setLoading(false)
    setCurrentProduct(null)
  } 

  const addTag = (event) => {
    if( tags.includes(newTag) ){
      alert('tag already in use')
      return
    }
    setTags([...tags, newTag])
  }

  return (
    <div className='max-h-screen overflow-scroll disable'>
      <div className="flex flex-col mt-8">
        { oldImages.map((item, index) => (
          <div key={item+index} className='bg-white rounded-lg flex flex-row w-11/12 p-2 m-2 relative backdrop-blur-2xl shadow-md'>
            <img src={item} className='h-8' />
            <p className="pt-2 pl-2">{"photo "+index}</p>
            <button className="absolute top-3 left-full" onClick={() => {setOldImages(oldImages.filter((image) => image!==item)); setImagesToBeDeleted([...imagesToBeDeleted, item])}}>
              <AiOutlineClose size={24}/>
            </button>
          </div>
        ))}
        { newImages.map((item, index) => (
          <div key={item+index} className='bg-white rounded-lg flex flex-row p-2 m-2 w-11/12 relative backdrop-blur-2xl shadow-md'>
            <img src={URL.createObjectURL(item)} className='h-8' />
            <p className="pt-2 pl-2">{item.name.length<16 ? item.name : item.name.slice(0, 17)+'...'}</p>
            <button className="absolute top-3 left-full" onClick={() => setNewImages(newImages.filter((image) => image !== item))}>
              <AiOutlineClose size={24}/>
            </button>
          </div>
        ))}
        <button className="m-2 p-2 rounded-lg bg-slate-200 backdrop-blur-2xl shadow-md hover:shadow-lg hover:opacity-90" onClick={() => setModal(true)}>+ Add Image</button>
        <input type='text' placeholder="Title" onChange={(e) => setTitle(e.target.value)} className='inputText' value={title}/>
        <textarea rows={4} placeholder='Description' onChange={(e) => setDescription(e.target.value)} className="textareaClass" value={description}/>
        <input type='text' placeholder="Category" onChange={(e) => setCategory(e.target.value)} className='inputText' value={category}/>
        <input type='text' placeholder="Materials" onChange={(e) => setMaterials(e.target.value)} className='inputText' value={materials}/>
        <textarea rows={4} placeholder='Brand Description' onChange={(e) => setBrandDescription(e.target.value)} className="textareaClass" value={brandDescription}/>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <input type='text' placeholder="Add tag" className="w-2/3 inputText" onChange={(e) => setNewTag(e.target.value)}/>
            <button className="w-1/3 hover:text-dashboard-main transition-all duration-300" onClick={addTag}>Add tag</button>
          </div>
          <div className="flex flex-row mx-2">
            { tags.map((tag, idx) => (
              <div key={tag+idx} className='bg-dashboard-main text-white p-2 m-2 rounded-xl relative'>
                <p>{tag}</p>
                <button className="absolute top-3 right-full text-black" onClick={() => setTags(tags.filter((item, index) => index !== idx))}>
                  <AiOutlineClose />
                </button>
              </div>
            ))}
          </div>
        </div>
        <input type='number' placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} className='inputText' value={quantity}/>
        { loading 
        ? <p>loading</p> :
        <div className="flex flex-row-reverse">
          <button className="bg-dashboard-main hover:bg-opacity-90 m-2 p-2 text-lg rounded-lg text-white hover:shadow-lg backdrop-blur-2xl shadow-md" onClick={handlePublish}>
            <div className="flex flex-row">
              <TiDocument size={20} className='mt-1 mr-2' />
              <p>Publish</p>
            </div>
          </button>
          {!isNew && <button className=" hover:text-opacity-75 m-2 p-2 text-lg rounded-lg" onClick={handleDelete}>
            <div className="flex flex-row">
              <AiOutlineDelete size={20} className='mt-1 mr-2' />
              <p>Delete Product</p>
            </div>
          </button>}
        </div>
        }
      </div>

      { modal &&
      <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div className='bg-white p-2 rounded-full relative'>
          <input type='file' onChange={(e) => {setNewImages([...newImages, e.target.files[0]]); setModal(false)}} />
          <button className="absolute top-3 left-full" onClick={() => setModal(false)}>
            <AiOutlineClose size={24}/>
          </button>
        </div>
      </div>
      }
    </div>
  )
}

export default PublishProduct