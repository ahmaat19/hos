import asyncHandler from 'express-async-handler'
import LaboratoryModel from '../models/laboratoryModel.js'
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

export const addResults = asyncHandler(async (req, res) => {
  const { data } = req.body
  const { _id: labRequest, patient, createdBy: doctor } = req.body.fillOut

  const TestFilterer = async (data, prefix) => {
    const bioChemistryTests = Object.entries(data).filter((a) =>
      a[0].startsWith(prefix)
    )
    const bioKeys = bioChemistryTests.map((m) => m[0].replace(`${prefix}_`, ''))
    const bioValues = bioChemistryTests.map((m) => m[1])
    const cleanBioChemistryTests = bioKeys.map((x, i) => [x, bioValues[i]])
    return cleanBioChemistryTests
  }

  const bioChemistry = await TestFilterer(data, 'bioChemistry')
  const hematology = await TestFilterer(data, 'hematology')
  const serology = await TestFilterer(data, 'serology')

  const createObj = await LaboratoryModel.create({
    patient: patient._id,
    doctor: doctor._id,
    labRequest,
    serology,
    bioChemistry,
    hematology,
    createdBy: req.user.id,
  })
  if (createObj) {
    const obj = await LabRequestModel.findById(labRequest)
    if (obj) {
      obj.isActive = false
      await obj.save()
      res.status(201).json({ status: 'success' })
    }
  } else {
    res.status(400)
    throw new Error('Invalid laboratory results full out data')
  }
})

export const getLaboratory = asyncHandler(async (req, res) => {
  const patient = await PatientModel.findOne({
    patientId: req.params.id.toUpperCase(),
  })
  if (patient) {
    const lab = await LaboratoryModel.find({
      patient: patient._id,
    })
      .populate('patient')
      .populate('doctor')
      .populate('labRequest')
      .populate('createdBy', 'name')
    if (lab) {
      res.status(201).json(lab)
    } else {
      res.status(400)
      throw new Error('Invalid laboratory data')
    }
  } else {
    res.status(400)
    throw new Error('Invalid laboratory data')
  }
})

export const updateResults = asyncHandler(async (req, res) => {
  const { data } = req.body

  const { _id } = req.body.fillOut

  const labTests = await LaboratoryModel.findById(_id)

  if (labTests) {
    const TestFilterer = async (data, prefix) => {
      const bioChemistryTests = Object.entries(data).filter((a) =>
        a[0].startsWith(prefix)
      )
      const bioKeys = bioChemistryTests.map((m) =>
        m[0].replace(`${prefix}_`, '')
      )
      const bioValues = bioChemistryTests.map((m) => m[1])
      const cleanBioChemistryTests = bioKeys.map((x, i) => [x, bioValues[i]])
      return cleanBioChemistryTests
    }

    const bioChemistry = await TestFilterer(data, 'bioChemistry')
    const hematology = await TestFilterer(data, 'hematology')
    const serology = await TestFilterer(data, 'serology')

    labTests.hematology = hematology
    labTests.bioChemistry = bioChemistry
    labTests.serology = serology
    labTests.updatedBy = req.user.id

    const updateObj = await labTests.save()

    if (updateObj) {
      res.status(201).json({ status: 'success' })
    }
  } else {
    res.status(400)
    throw new Error('Invalid laboratory results updating')
  }
})
