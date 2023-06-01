import express from 'express'
import checkAuth from '../middleware/authMW.js'
import checkAuthStore from '../middleware/authStoreMW.js';

const router = express.Router();

router.get('/', checkAuthStore, (req, res) => {
    res.json({ status: 'success' })
})

export default router