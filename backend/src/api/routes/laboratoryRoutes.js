import express from 'express'
import { getRequestedLab } from '../controllers/laboratoryController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/:id').get(protect, getRequestedLab)

export default router
