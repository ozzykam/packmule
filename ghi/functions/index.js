const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./app/auth');
const muleRoutes = require('./app/mules');
// TODO: Add gigs, specialties, users routes

const app = express();
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/mules', muleRoutes);

exports.api = functions.https.onRequest(app);
