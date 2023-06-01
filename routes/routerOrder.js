import express from 'express'
import checkAuthStore from '../middleware/authStoreMW.js'
import {
    getOrders,
    getCompleteOrders,
    changeStatus,
    getTracking
} from '../controllers/ordersCO.js'

const router = express.Router();

router.get('/', checkAuthStore, getOrders)
router.get('/type/:type', checkAuthStore, getCompleteOrders)
router.post('/status', checkAuthStore, changeStatus)

router.get('/tracking/:track', getTracking)

export default router