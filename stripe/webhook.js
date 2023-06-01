import { Stripe } from 'stripe'
import dotenv from 'dotenv'
import Order from '../MongoDB/models/Order.js'
import Menu from '../MongoDB/models/Menu.js'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    
    // Logic
    const {customerName, order, tracking, paymentId} = session.metadata
    const {email} = session.customer_details

    let paid = false
    if(session.payment_status === 'paid') paid = true

    const total = Number(session.amount_total) / 100

    //-----
    const fetchedOrder = await Promise.all(JSON.parse(order).map(async item => {
      let menuItem = await Menu.findOne({ ref: item.r }).select('-_id name photo')

      return {
          n: menuItem.name,
          q: item.q,
          i: menuItem.photo
      }
    }))
    //-----

    const orderObj = {
        name: customerName,
        order: JSON.stringify(fetchedOrder),
        total,
        tracking,
        paymentId: session.payment_intent,
        paid,
        complete: false,
        status: 'waiting',
        email
    }

    try {
        const newOrder = new Order(orderObj)
        const saveOrder = await newOrder.save()
    } catch (error) {
        console.log(`Order coundlt save ${error}`)
    }

    console.log(`Payment was successful for session: ${session.id}`);
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send()
}
export default webhook
