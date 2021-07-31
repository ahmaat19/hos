import mongoose from 'mongoose'

const routeScheme = mongoose.Schema(
  {
    name: {
      type: String,
      requited: true,
    },
    component: {
      type: String,
      requited: true,
    },
    path: {
      type: String,
      requited: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const RouteModel = mongoose.model('Route', routeScheme)
export default RouteModel
