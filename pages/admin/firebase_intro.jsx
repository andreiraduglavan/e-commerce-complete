import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from '../../firebase/clientApp'
import { useEffect, useState } from "react"
import { collection, doc, getDocs, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { AiOutlineClose } from 'react-icons/ai'

const firebase_intro = () => {
  const [newObject, setNewObject] = useState('')
  const [objects, setObjects] = useState([])
  const [user, loading, error] = useAuthState(auth)
  const objectsCollectionRef = collection(db, 'objects')
  
  useEffect(() => {
    const getObjects = async () => {
      const data = await getDocs(objectsCollectionRef)
      setObjects(data.docs.map((doc)=> ({...doc.data(), id:doc.id})))
    }
    
    getObjects()
  }, [])

  const createObject = async () => {
    await setDoc(doc(objectsCollectionRef, 'lala1'), { object: newObject, quantity: 1}).then(async (response) => {
      const docRef = doc(db, "objects", 'lala1')
      const docSnap = await getDoc(docRef)

      setObjects([...objects, {...docSnap.data(), id:docSnap.id}])
    })
  }

  const increaseQty = async (id, quantity) => {
    const objectDoc = doc(db, "objects", id)
    const newFields = {quantity: quantity+1}
    
    await updateDoc(objectDoc, newFields)

    const index = objects.findIndex((object) => object.id === id)
    const newObjects = objects.filter((item) => item.id !== id)
    const foundObject = objects.find((item) => item.id === id)

    newObjects.splice(index, 0, {...foundObject, quantity:foundObject.quantity+1})
    setObjects(newObjects)
  }

  const deleteObject = async (id) => {
    const objectDoc = doc(db, "objects", id)
    await deleteDoc(objectDoc)

    const newObjects = objects.filter((item) => item.id !== id)
    setObjects(newObjects)
  }

  return (
    <div>
      <input type='text' placeholder='write an object' onChange={(e) => setNewObject(e.target.value)}/>
      <button onClick={createObject}>submit</button>
      {objects.map((obj, index) => (
        <div key={index}>
          <p>{obj.object} {obj.quantity}</p>
          <button onClick={() => {increaseQty(obj.id, obj.quantity)}}>increase quantity</button>
          <button className="delete-button" onClick={() => deleteObject(obj.id)}>
            <AiOutlineClose />
          </button>
        </div>
      ))}
    </div>
  )
}



export default firebase_intro