const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const admin = require('firebase-admin')

// Initialize Admin SDK
admin.initializeApp()
const db = admin.firestore()

// Import your routes (passing db into each route module)
const authRoutes = require('./app/auth')(db)
const muleRoutes = require('./app/mules')(db)
const gigRoutes = require('./app/gigs')(db)
const specialtyRoutes = require('./app/specialtys')(db)

// Express app setup
const app = express()
app.use(cors({ origin: 'https://packmule-650ce.web.app', credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Route mounting
app.use('/api/auth', authRoutes)
app.use('/api/mule', muleRoutes)
app.use('/api/gigs', gigRoutes)
app.use('/api/specialtys', specialtyRoutes)

// Deployable function export
exports.api = functions.https.onRequest(app)
