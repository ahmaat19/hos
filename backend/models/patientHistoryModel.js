import mongoose from 'mongoose'

const patientHistoryScheme = mongoose.Schema(
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
    chiefComplain: { type: String, required: true },
    hpi: { type: String, required: true },
    pmh: { type: String, required: true },
    generalAppearance: { type: String, required: true },
    bloodPressure: { type: String, required: true },
    temperature: { type: String, required: true },
    pulse: { type: String, required: true },
    respiratory: { type: String, required: true },
    weight: { type: String, required: true },
    height: { type: String, required: true },
    spO2: { type: String, required: true },
    systemicExamination: { type: String, required: true },
    suspectDiagnosis: { type: String, required: true },
    definitive: { type: String, required: true },
    ageType: { type: String },
    reproductiveType: { type: String },
    noOfChildren: { type: Number },
    gravida: { type: Number },
    pra: { type: Number },
    abortion: { type: Number },
    stillBirth: { type: Number },
    alive: { type: Number },
    svd: { type: String },
    vacuum: { type: String },
    induction: { type: String },
    forcep: { type: String },
    cSection: { type: String },
    craniotomy: { type: String },
    embryotomy: { type: String },
    ageOfLastBaby: { type: String },
    lactated: { type: Boolean },
    couple: { type: Boolean },
    howManyYears: { type: Number },
    pregnancy: { type: Boolean },
    lmp: { type: String },
    ga: { type: String },
  },
  {
    timestamps: true,
  }
)

const PatientHistoryModel = mongoose.model(
  'PatientHistory',
  patientHistoryScheme
)
export default PatientHistoryModel
