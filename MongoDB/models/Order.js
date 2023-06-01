import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    order: {
        type: [String],
        required: true
    },
    total: {
        type: String,
        required: true
    },
    tracking: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    paid: {
        type: Boolean,
        required: true
    },
    complete: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order