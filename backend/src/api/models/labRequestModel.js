import mongoose from 'mongoose'

const LabRequestScheme = mongoose.Schema(
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
    hematology: { type: [String] },
    serology: { type: [String] },
    bioChemistry: { type: [String] },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const LabRequestModel = mongoose.model('LabRequest', LabRequestScheme)
export default LabRequestModel
