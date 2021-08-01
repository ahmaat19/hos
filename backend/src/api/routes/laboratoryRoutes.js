import express from 'express'
import {
  addResults,
  getRequestedLab,
  getLaboratory,
  updateResults,
} from '../controllers/laboratoryController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, addResults).put(protect, updateResults)
router.route('/:id').get(protect, getRequestedLab)
router.route('/edit/:id').get(protect, getLaboratory)

export default router
