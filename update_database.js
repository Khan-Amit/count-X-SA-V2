// update_database.js - Run with: node update_database.js
const fs = require('fs');

async function fetchAPI(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data[1]?.[0]?.value || null;
  } catch (e) {
    return null;
  }
}

async function updateDatabase() {
  const countries = {
    BD: { code: 'BGD', currency: 'BDT', rate: 110 },
    IN: { code: 'IND', currency: 'INR', rate: 83 },
    TH: { code: 'THA', currency: 'THB', rate: 34 },
    CA: { code: 'CAN', currency: 'CAD', rate: 1.35 }
  };
  
  const database = {};
  
  for (const [key, info] of Object.entries(countries)) {
    console.log(`Fetching ${key}...`);
    
    const population = await fetchAPI(`https://api.worldbank.org/v2/country/${info.code}/indicator/SP.POP.TOTL?format=json`);
    const birth = await fetchAPI(`https://api.worldbank.org/v2/country/${info.code}/indicator/SP.DYN.CBRT.IN?format=json`);
    const death = await fetchAPI(`https://api.worldbank.org/v2/country/${info.code}/indicator/SP.DYN.CDRT.IN?format=json`);
    const growth = await fetchAPI(`https://api.worldbank.org/v2/country/${info.code}/indicator/SP.POP.GROW?format=json`);
    
    database[key] = {
      demographics: { population, birth, death, growth },
      currency: info.currency,
      exchange_rate: info.rate,
      last_updated: new Date().toISOString()
    };
  }
  
  fs.writeFileSync('database.json', JSON.stringify(database, null, 2));
  console.log('✅ database.json updated!');
}

updateDatabase();
