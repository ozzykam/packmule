const functions = require('firebase-functions');

// Simple HTTP function
exports.helloWorld = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({
        message: 'Hello from PackMule API!',
        timestamp: new Date().toISOString(),
    });
});

// Test API function
exports.testApi = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({
        status: 'working',
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString(),
    });
});
