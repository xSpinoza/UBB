import express from 'express'
import {
    login,
    loginStore
} from '../controllers/userAdminCO.js'

const router = express.Router();

router.post('/', login)
router.post('/UBB', loginStore)

export default router