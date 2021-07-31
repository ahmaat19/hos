import asyncHandler from 'express-async-handler'
import PatientHistoryModel from '../models/PatientHistoryModel.js'

export const addPatientHistory = asyncHandler(async (req, res) => {
  const {
    patient,
    chiefComplain,
    hpi,
    pmh,
    generalAppearance,
    bloodPressure,
    temperature,
    pulse,
    respiratory,
    weight,
    height,
    spO2,
    systemicExamination,
    suspectDiagnosis,
    definitive,
    ageType,
    reproductiveType,
    noOfChildren,
    gravida,
    para,
    abortion,
    stillBirth,
    alive,
    svd,
    vacuum,
    induction,
    forcep,
    cSection,
    craniotomy,
    embryotomy,
    ageOfLastBaby,
    lactated,
    couple,
    howManyYears,
    pregnancy,
    lmp,
    ga,
  } = req.body
  const createdBy = req.user.id

  const createObj = await PatientHistoryModel.create({
    patient,
    chiefComplain,
    hpi,
    pmh,
    generalAppearance,
    bloodPressure,
    temperature,
    pulse,
    respiratory,
    weight,
    height,
    spO2,
    systemicExamination,
    suspectDiagnosis,
    definitive,
    ageType,
    reproductiveType,
    noOfChildren,
    gravida,
    para,
    abortion,
    stillBirth,
    alive,
    svd,
    vacuum,
    induction,
    forcep,
    cSection,
    craniotomy,
    embryotomy,
    ageOfLastBaby,
    lactated,
    couple,
    howManyYears,
    pregnancy,
    lmp,
    ga,
    createdBy,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid history data')
  }
})

export const updatePatientHistory = asyncHandler(async (req, res) => {
  const patient = req.body.patient
  const {
    chiefComplain,
    hpi,
    pmh,
    generalAppearance,
    bloodPressure,
    temperature,
    pulse,
    respiratory,
    weight,
    height,
    spO2,
    systemicExamination,
    suspectDiagnosis,
    definitive,
    ageType,
    reproductiveType,
    noOfChildren,
    gravida,
    para,
    abortion,
    stillBirth,
    alive,
    svd,
    vacuum,
    induction,
    forcep,
    cSection,
    craniotomy,
    embryotomy,
    ageOfLastBaby,
    lactated,
    couple,
    howManyYears,
    pregnancy,
    lmp,
    ga,
  } = req.body.obj
  const updatedBy = req.user.id
  const _id = req.params.id

  const obj = await PatientHistoryModel.findById(_id)

  if (obj) {
    obj.patient = patient
    obj.chiefComplain = chiefComplain
    obj.hpi = hpi
    obj.pmh = pmh
    obj.generalAppearance = generalAppearance
    obj.bloodPressure = bloodPressure
    obj.temperature = temperature
    obj.pulse = pulse
    obj.respiratory = respiratory
    obj.weight = weight
    obj.height = height
    obj.spO2 = spO2
    obj.systemicExamination = systemicExamination
    obj.suspectDiagnosis = suspectDiagnosis
    obj.definitive = definitive
    obj.ageType = ageType
    obj.reproductiveType = reproductiveType
    obj.noOfChildren = noOfChildren
    obj.gravida = gravida
    obj.para = para
    obj.abortion = abortion
    obj.stillBirth = stillBirth
    obj.alive = alive
    obj.svd = svd
    obj.vacuum = vacuum
    obj.induction = induction
    obj.forcep = forcep
    obj.cSection = cSection
    obj.craniotomy = craniotomy
    obj.embryotomy = embryotomy
    obj.ageOfLastBaby = ageOfLastBaby
    obj.lactated = lactated
    obj.couple = couple
    obj.howManyYears = howManyYears
    obj.pregnancy = pregnancy
    obj.lmp = lmp
    obj.ga = ga
    obj.updatedBy = updatedBy
    await obj.save()
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('History not found')
  }
})

export const getPatientHistory = asyncHandler(async (req, res) => {
  let query = PatientHistoryModel.find({})

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await PatientHistoryModel.countDocuments()

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

export const getPatientHistoryDetail = asyncHandler(async (req, res) => {
  const patient = await PatientHistoryModel.findById(req.params.id)
  if (patient) {
    res.json(patient)
  } else {
    res.status(404)
    throw new Error('Patient not found')
  }
})

export const deletePatientHistory = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await PatientHistoryModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('History not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
