import express from 'express'
import {
  addPatient,
  deletePatient,
  getPatient,
  updatePatient,
} from '../controllers/patientController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, addPatient).get(protect, getPatient)
router
  .route('/:id')
  .delete(protect, admin, deletePatient)
  .put(protect, admin, updatePatient)

export default router
