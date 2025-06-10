const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');
admin.initializeApp();

const authRoutes = require('./app/auth');
const muleRoutes = require('./app/mules');
const gigRoutes = require('./app/gigs');
const specialtyRoutes = require('./app/specialtys');

const app = express();
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/mules', muleRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/specialtys', specialtyRoutes);

exports.api = functions.https.onRequest(app);
