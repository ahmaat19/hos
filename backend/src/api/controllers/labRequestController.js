import asyncHandler from 'express-async-handler'
import LabRequestModel from '../models/LabRequestModel.js'
import PatientModel from '../models/PatientModel.js'

export const addLabRequest = asyncHandler(async (req, res) => {
  const { patient, serology, bioChemistry, hematology } = req.body
  const createdBy = req.user.id

  const createObj = await LabRequestModel.create({
    patient,
    serology,
    bioChemistry,
    hematology,
    isActive: true,
    createdBy,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid laboratory request data')
  }
})

export const updateLabRequest = asyncHandler(async (req, res) => {
  const { patient, serology, bioChemistry, hematology } = req.body
  const updatedBy = req.user.id
  const _id = req.params.id

  const obj = await LabRequestModel.findById(_id)

  if (obj) {
    obj.patient = patient
    obj.serology = serology
    obj.bioChemistry = bioChemistry
    obj.hematology = hematology
    obj.isActive = true
    obj.updatedBy = updatedBy
    obj.createdBy = updatedBy
    await obj.save()
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Laboratory request not found')
  }
})

export const getLabRequest = asyncHandler(async (req, res) => {
  let query = LabRequestModel.find({})

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await LabRequestModel.countDocuments()

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
    .populate('patient')

  const result = await query

  res.status(200).json({
    startIndex: skip + 1,
    endIndex: skip + result.length,
    count: result.length,
    page,
    pages,
    total,
    data: result,
  })
})

export const deleteLabRequest = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await LabRequestModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Laboratory request not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})

export const getPatients = asyncHandler(async (req, res) => {
  const patients = await PatientModel.find({})
  res.status(200).json(patients)
})
