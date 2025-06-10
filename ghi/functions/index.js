const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./app/auth');
// TODO: Add mules, gigs, specialties, users routes

const app = express();
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

exports.api = functions.https.onRequest(app);
