import express from 'express'
import {
  addPatientHistory,
  deletePatientHistory,
  getPatientHistory,
  updatePatientHistory,
  getPatientHistoryDetail,
} from '../controllers/patientHistoryController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .post(protect, addPatientHistory)
  .get(protect, getPatientHistory)
router
  .route('/:id')
  .delete(protect, deletePatientHistory)
  .put(protect, updatePatientHistory)
  .get(protect, getPatientHistoryDetail)

export default router
