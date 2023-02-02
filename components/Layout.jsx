import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import AdminNavbar from './admin/AdminNavbar'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'

const Layout = ({children}) => {
  const router = useRouter()
  const bgColor = router.pathname.includes('/admin') ? "#f1f4f9" : "white"

  return (
    <div className='layout font-montserrat min-h-screen' style={{backgroundColor:bgColor}}>
      <Head>
        <title>SHOP</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.9" />
      </Head>
      <header>
        { !router.pathname.includes('/admin') && 
          <Navbar />
        }
      </header>
      <main className='main-container flex'>
        { router.pathname.includes('/admin') && 
          <AdminNavbar />
        }
        <div className='w-full'>
          {children}
        </div>
      </main>
      <footer>
      { !router.pathname.includes('/admin') && 
          <Footer />
        }
      </footer>
    </div>
  )
}

export default Layout