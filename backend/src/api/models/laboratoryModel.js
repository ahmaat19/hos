import mongoose from 'mongoose'

const LaboratoryScheme = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    labRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LabRequest',
      required: true,
    },
    hematology: { type: [] },
    serology: { type: [] },
    bioChemistry: { type: [] },
  },
  {
    timestamps: true,
  }
)

const LaboratoryModel = mongoose.model('Laboratory', LaboratoryScheme)
export default LaboratoryModel
