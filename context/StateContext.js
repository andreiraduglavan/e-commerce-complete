import React, { useContext, useState, createContext, } from "react";

const Context = createContext()

export const StateContext = ({children}) => {

  const [currentProduct, setCurrentProduct] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [currentBanner, setCurrentBanner] = useState(null)
  const [isNewBanner, setIsNewBanner] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [cartIds, setCartIds] = useState([])
  const [cartQty, setCartQty] = useState(0)

  const addItem = (item) => {
    if(cartIds.includes(item.id)) {
      var oldQty = cartItems.filter((item1) => item1.id===item.id)[0].userQty
      setCartItems([...cartItems.filter((item1) => item1.id!==item.id), {...item, userQty:oldQty+1}])
    }
    else {
      setCartItems([...cartItems, {...item, userQty:1}])
      setCartIds([...cartIds, item.id])
    }
    setCartQty(cartQty+1)
  }

  const removeItem = (item) => {
    setCartItems(cartItems.filter((item1) => item1.id!==item.id))
    setCartIds(cartIds.filter((id1) => id1!==item.id))
    setCartQty(cartQty-item.userQty)
  }
  
  return(
    <Context.Provider value={{ currentProduct, setCurrentProduct, currentBanner, setCurrentBanner, isNewBanner, setIsNewBanner, isNew, setIsNew, showCart, setShowCart, cartItems, setCartItems, addItem, removeItem, cartQty, }}>
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)