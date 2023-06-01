import Order from '../MongoDB/models/Order.js'
import { refundOrder } from '../routes/routerCheckout.js'

const getOrders = async (req, res) => {
    const orders = await Order.find({ complete: false })
    res.json({orders})
}

const getCompleteOrders = async (req, res) => {
    const {type} = req.params
    let orders

    if(type === 'completed') orders = await Order.find({ complete: true, status: 'completed' })
    else orders = await Order.find({ complete: true, status: { $ne: 'completed' }})

    res.json({orders})
}

const changeStatus = async (req, res) => {
    const {id, status} = req.body

    const order = await Order.findById(id)
    order.status = status

    if(status !== 'accepted') order.complete = true

    if(!order.complete && status === 'canceled' || status === 'declined'){
        const refund = await refundOrder(order.paymentId)
    }

    const saveOrder = await order.save()
    res.json({order})
}

const getTracking = async (req, res) => {
    const {track} = req.params
    let order = {
        error: true
    }
    try {
        const orderCall = await Order.findOne({tracking: track}).select('-_id name total status date order')
        if(orderCall) order = orderCall
    } catch (error) {
        console.log(error)
    }

    res.json(order)
}

export{
    getOrders,
    getCompleteOrders,
    changeStatus,
    getTracking
}