import Stripe from 'stripe'
import { buffer } from 'micro'
import { db } from '../../../firebase/clientApp'
import { collection, addDoc } from "firebase/firestore"

const ordersCollectionRef = collection(db, 'orders')

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KET)
const webhookSecret = 'whsec_f9d7e70776c7c08c77ee4a1ca3cf14dcfb5bb6c22045b22924991fee14ac5824'

const handler = async(req, res) => {
  const sig = req.headers['stripe-signature']
  const reqBuffer = await buffer(req)
  
  let event
  
  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, webhookSecret)
  } catch (err) {
    console.log(`❌ Error message: ${err.message}`)
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      const data = event.data.object
      const lineItems = await stripe.checkout.sessions.listLineItems(data.id)
      
      await addDoc(ordersCollectionRef, { customer_details: data.customer_details, products: lineItems})
      break
    // ... handle other event types
    
    default:
      console.log(`Unhandled event type ${event.type}`)
      
  }

  res.send({ received: true} )
}

export default handler