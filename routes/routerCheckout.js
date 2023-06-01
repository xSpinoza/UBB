import express, { json } from 'express'
import { Stripe } from 'stripe'
import dotenv from 'dotenv'
import Menu from '../MongoDB/models/Menu.js'
import {generateId} from '../helpers/index.js'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)
const router = express.Router()

router.post('/', async (req, res) => {
    const {order, customer} = req.body

    let customerName;
    if(customer){
      customerName = customer.trim()
    } else{
      return res.json({msg: 'Provide a pickup name'})
    }

    const tracking = generateId()

    const promises = order.map(item => Menu.findById(item.id).select('name price ref'))
    const results = await Promise.all(promises)

    let orderSend = []

    let newArray = results.map(item => {
      let orderFilter = order.find(subItem => subItem.id === item.id)

      orderSend.push({
        r: item.ref,
        q: orderFilter.qty
      })

      return {
        id: item.id,  
        price: Number(item.price),
        name: orderFilter.name,
        qty: orderFilter ? orderFilter.qty : 0,
        photo: orderFilter.photo
      }
    })

    let line_items = newArray.map(item => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.photo]
          },
          unit_amount: Math.round((((item.price / 100) * 7) + item.price) * 100),
        },
        quantity: item.qty,
      }
    })

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',

        metadata: {
          customerName,
          order: JSON.stringify(orderSend),
          tracking,
        },

        success_url: `${process.env.FRONTEND_URL}/order/tracking/${tracking}`,
        cancel_url: `${process.env.FRONTEND_URL}/order`,
      })
      
      res.send({url: session.url})
    } catch (error) {
      console.log(error)
      res.status(500).send("Error creating checkout session.")
    }
})

const refundOrder = async id => {
  try {
    const action = await stripe.refunds.create({ payment_intent: id })

    return action
  } catch (error) {
    console.error('Error:', error)
    throw error;
  }
}

export{
  refundOrder
}

export default router