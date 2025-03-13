const express = require("express");
const mongoose = require("mongoose");
const fs = require('fs'); // Required for reading SSL certificate and key
const https = require('https');
const os = require('os');

const getSystemIP = () => {
    const networkInterfaces = os.networkInterfaces();
    for (let name of Object.keys(networkInterfaces)) {
        for (let net of networkInterfaces[name]) {
            if (net.family === 'IPv4' &&!net.internal) {
                return net.address;
            }
        }
    }
    throw new Error('Unable to determine system IP address.');
}

const app = express();

app.use(express.json());

mongoose.connect(
  "your-database-Adress with password",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Import the routes
const router = require("./routes/routes.js");

app.use(router);

// Correctly load the SSL certificate and key
const privateKey = fs.readFileSync('./key.pem', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8'); 
const credentials = { key: privateKey, cert: certificate }; 

const httpsOptions = {
    secureProtocol: 'TLSv1_2_method',
    ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384' 
};

// Create the HTTPS server
const httpsServer = https.createServer(credentials, app);

const port = 3000;


httpsServer.listen(port, () => {
    console.log(`HTTPS server is running on https://${getSystemIP()}:${port}`);
});
