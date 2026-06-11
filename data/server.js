const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Endpoint to get all country data
app.get('/api/countries', (req, res) => {
  try {
    const countries = {
      BD: JSON.parse(fs.readFileSync('./data/BD.json', 'utf8')),
      IN: JSON.parse(fs.readFileSync('./data/IN.json', 'utf8')),
      TH: JSON.parse(fs.readFileSync('./data/TH.json', 'utf8')),
      CA: JSON.parse(fs.readFileSync('./data/canada.json', 'utf8'))
    };
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get live demographics from database.json
app.get('/api/live-data', (req, res) => {
  try {
    const liveData = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
    res.json(liveData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
