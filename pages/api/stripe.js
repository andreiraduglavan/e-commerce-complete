import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KET);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        shipping_options: [
          { shipping_rate: 'shr_1LOKwBIopjjq8pghj4jn0zWy'},
          { shipping_rate: 'shr_1LOKwiIopjjq8pghtv35R2lh'}
        ],
        line_items: req.body.map((item) => (
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.id,
                images: [item.images[0]]
              },
              unit_amount: item.quantity*100
            },
            quantity:item.userQty
          }
        )),
        metadata: { status: 'ok'},
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      }
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}