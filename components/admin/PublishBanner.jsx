import { useRouter } from 'next/router'
import {  db, storage } from '../../firebase/clientApp'
import { collection, doc, addDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { useState, useEffect } from "react"
import { useStateContext } from '../../context/StateContext'
import { AiOutlineClose } from 'react-icons/ai'
import { TiDocument } from 'react-icons/ti'
import { v4 } from 'uuid'
import { getPath } from '../../utils/utils'

const PublishBanner = () => {
  const collectionRef = collection(db, 'banners')
  const { currentBanner, isNewBanner, setCurrentBanner } = useStateContext()
  const router = useRouter()
  
  const [title, setTitle] = useState(isNewBanner ? "" : currentBanner.title)
  const [oldImage, setOldImage] = useState(isNewBanner ? "" : currentBanner.image)
  const [text, setText] = useState(isNewBanner ? "" : currentBanner.text)
  const [buttonText, setButtonText] = useState(isNewBanner ? "" : currentBanner.button_text)
  const [linkTo, setLinkTo] = useState(isNewBanner ? "" : currentBanner.link_to)
  const [textColor, setTextColor] = useState(isNewBanner ? "" : currentBanner.text_color)
  const [newImage, setNewImage] = useState(null)

  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTitle(isNewBanner ? "" : currentBanner.title)
    setOldImage(isNewBanner ? "" : currentBanner.image)
    setText(isNewBanner ? "" : currentBanner.text)
    setButtonText(isNewBanner ? "" : currentBanner.button_text)
    setLinkTo(isNewBanner ? "" : currentBanner.link_to)
    setTextColor(isNewBanner ? "" : currentBanner.text_color)
    setNewImage(null)
  }, [currentBanner, isNewBanner])

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

  const handlePublish = async () => {
    setLoading(true)

    if (isNewBanner) {
      var url = await uploadImage(newImage)

      await addDoc(collectionRef, { title:title, button_text:buttonText, image:url, link_to:linkTo, text:text, text_color:textColor })
    }
    else {
      if (newImage) {
        var url = await uploadImage(newImage)
        deleteImage(oldImage)

        const bannerDoc = doc(db, 'banners', currentBanner.id)
        const newFields = { title:title, button_text:buttonText, image:url, link_to:linkTo, text:text, text_color:textColor }
        await updateDoc(bannerDoc, newFields)

      }
      else {
        const bannerDoc = doc(db, 'banners', currentBanner.id)
        const newFields = { title:title, button_text:buttonText, link_to:linkTo, text:text, text_color:textColor }
        await updateDoc(bannerDoc, newFields)
      }
    }
    setLoading(false)
    setCurrentBanner(null)
  }

  return (
    <div className='max-h-screen overflow-scroll disable'>
      <div className='flex flex-col mt-8'>
        <div className='bg-white rounded-lg flex flex-row p-2 m-2 relative backdrop-blur-2xl shadow-md'>
          { newImage ?
            <>
              <img src={URL.createObjectURL(newImage)} className='h-8' />
              <p className="pt-2 pl-2">{newImage.name.length<16 ? newImage.name : newImage.name.slice(0, 17)+'...'}</p>
            </>
            : 
            <>
              <img src={oldImage} className='h-8' />
              <p className="pt-2 pl-2">Photo</p>
            </>
          }
        </div>
        <button className="m-2 p-2 rounded-lg bg-slate-200 hover:shadow-lg hover:opacity-90 backdrop-blur-2xl shadow-md" onClick={() => setModal(true)}>Change Image</button>
        
        <input type='text' placeholder="Title" onChange={(e) => setTitle(e.target.value)} className='inputText' value={title}/>
        <textarea rows={4} placeholder="Text" onChange={(e) => setText(e.target.value)} className='textareaClass' value={text}/>
        <input type='text' placeholder="Link To" onChange={(e) => setLinkTo(e.target.value)} className='inputText' value={linkTo}/>
        <input type='text' placeholder="Button Text" onChange={(e) => setButtonText(e.target.value)} className='inputText' value={buttonText}/>
        <div className='flex flex-row m-2 p-2 my-4'>
          <p>Choose text color:</p>
          {['black', 'white'].map((item) => (
            <div key={item}>
              <input type="radio" id={item} name="text_color" value={item} className='hidden peer' onChange={(e) => setTextColor(e.target.value)} checked={item===textColor ? true : false}/>
              <label htmlFor={item} className="inputText backdrop-blur-2xl shadow-md hover:bg-opacity-75 hover:shadow-lg peer-checked:bg-dashboard-main peer-checked:text-white cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
        

        { loading 
        ? <p>loading</p> :
        <div className="flex flex-row-reverse">
          <button className="bg-dashboard-main hover:bg-opacity-90 m-2 p-2 text-lg rounded-lg text-white  hover:shadow-lg backdrop-blur-2xl shadow-md" onClick={handlePublish}>
            <div className="flex flex-row">
              <TiDocument size={20} className='mt-1 mr-2' />
              <p>Publish</p>
            </div>
          </button>
        </div>
        }
      </div>

      { modal &&
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
          <div className='bg-white p-2 rounded-full relative'>
            <input type='file' onChange={(e) => {setNewImage(e.target.files[0]); setModal(false)}} />
            <button className="absolute top-3 left-full" onClick={() => setModal(false)}>
              <AiOutlineClose size={24}/>
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default PublishBanner