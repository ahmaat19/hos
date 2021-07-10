import asyncHandler from 'express-async-handler'
import PatientModel from '../models/PatientModel.js'

export const addPatient = asyncHandler(async (req, res) => {
  const { patientName, age, gender, mobile } = req.body
  const createdBy = req.user.id

  const patientCount = await PatientModel.countDocuments()
  const patientId = `P${patientCount + 1}`

  console.log(patientCount)
  console.log(patientId)

  const createObj = await PatientModel.create({
    patientId,
    patientName,
    age,
    gender,
    mobile,
    createdBy,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid patient data')
  }
})

export const updatePatient = asyncHandler(async (req, res) => {
  const { patientName, age, gender, mobile } = req.body
  const updatedBy = req.user.id
  const _id = req.params.id

  const obj = await PatientModel.findById(_id)

  if (obj) {
    obj.patientName = patientName
    obj.age = age
    obj.gender = gender
    obj.mobile = mobile
    obj.updatedBy = updatedBy
    await obj.save()
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Patient not found')
  }
})

export const getPatient = asyncHandler(async (req, res) => {
  let query = PatientModel.find({})

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await PatientModel.countDocuments()

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')

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

export const deletePatient = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await PatientModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Patient not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
