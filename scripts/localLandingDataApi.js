// Simple local API for editing landingData.json
// Usage: Start this server locally, then POST updated data from your admin editor

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(express.json());

const DATA_PATH = path.join(__dirname, '../src/data/landingData.json');

app.post('/update-landing-data', (req, res) => {
    const newData = req.body;
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(newData, null, 2));
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Local landingData API running at http://localhost:${PORT}`);
});
