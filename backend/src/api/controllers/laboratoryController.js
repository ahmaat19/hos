import asyncHandler from 'express-async-handler'
import LabRequestModel from '../models/LabRequestModel.js'
import PatientModel from '../models/PatientModel.js'

export const getRequestedLab = asyncHandler(async (req, res) => {
  const patient = await PatientModel.findOne({
    patientId: req.params.id.toUpperCase(),
  })
  if (patient) {
    const lab = await LabRequestModel.find({
      patient: patient._id,
      isActive: true,
    })
      .populate('patient')
      .populate('createdBy', 'name')
    if (lab) {
      res.status(201).json(lab)
    } else {
      res.status(400)
      throw new Error('Invalid laboratory request data')
    }
  } else {
    res.status(400)
    throw new Error('Invalid laboratory request data')
  }
})
