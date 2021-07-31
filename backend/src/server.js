import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './api/middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import userRoutes from './api/routes/userRoutes.js'
import groupRoutes from './api/routes/groupRoutes.js'
import routeRoutes from './api/routes/routeRoutes.js'
import patientRoutes from './api/routes/patientRoutes.js'
import labRequestRoutes from './api/routes/labRequestRoutes.js'
import patientHistoryRoutes from './api/routes/patientHistoryRoutes.js'
import laboratoryRoutes from './api/routes/laboratoryRoutes.js'

dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/routes', routeRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/lab-requests', labRequestRoutes)
app.use('/api/histories', patientHistoryRoutes)
app.use('/api/laboratory', laboratoryRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running ${process.env.NODE_ENV} mode on post ${PORT}`.yellow.bold
  )
)
