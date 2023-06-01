import express from 'express'
import multer from 'multer'
import checkAuth from '../middleware/authMW.js'
import { 
    create,
    adminList,
    deleteItem,
    activeToggle,
    edit,
    editP,
} from '../controllers/menuCO.js';
const upload = multer();

const router = express.Router();

router.get('/list/:id', checkAuth, adminList)
router.delete('/delete/:id', checkAuth, deleteItem)
router.post('/activeT/:id', checkAuth, activeToggle)
router.post('/create', checkAuth, upload.single('image'), create)
router.post('/edit/:id', checkAuth, edit)
router.post('/editP/:id', checkAuth, upload.single('image'), editP)

export default router