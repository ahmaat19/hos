import express from 'express'
import {
  addLabRequest,
  deleteLabRequest,
  getLabRequest,
  updateLabRequest,
  getPatients,
} from '../controllers/labRequestController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, addLabRequest).get(protect, getLabRequest)
router.route('/patients').get(protect, getPatients)
router
  .route('/:id')
  .delete(protect, admin, deleteLabRequest)
  .put(protect, admin, updateLabRequest)

export default router
