const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');

// 🔧 LOCKING IN GEN2: Explicit projectId assignment
const projectId = process.env.GCLOUD_PROJECT || 'packmule-650ce';

admin.initializeApp({
    projectId,
});

const db = admin.firestore();
module.exports.db = db; // export for submodules

const authRoutes = require('./app/auth');
const muleRoutes = require('./app/mules');
const gigRoutes = require('./app/gigs');
const specialtyRoutes = require('./app/specialtys');

const app = express();

app.use(
    cors({
        origin: 'https://packmule-650ce.web.app',
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/mule', muleRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/specialtys', specialtyRoutes);

exports.api = functions.https.onRequest(app);
