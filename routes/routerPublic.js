import express from 'express'
import {
    menu
} from '../controllers/publicCO.js'

const router = express.Router();

router.get('/:category', menu)

export default router