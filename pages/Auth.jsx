import React from 'react'
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import { auth } from '../firebase/clientApp'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useRouter } from 'next/router'

const Auth = () => {
  
  const provider = new GoogleAuthProvider()
  const router = useRouter()

  const signIn = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(result)
      router.push('/')
      
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    })
  }
  
  
  return (
    <button onClick={signIn}>Sign in with Google</button>
  )
}

export default Auth