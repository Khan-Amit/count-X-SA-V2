// update_database.js - Run with Node.js to fetch and save data
const fs = require('fs');
const https = require('https');

async function fetchWorldBank(countryCode, indicator) {
  return new Promise((resolve) => {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const value = json[1]?.[0]?.value;
          resolve(value ? parseFloat(value) : null);
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function updateAllCountries() {
  const countries = {
    BD: { name: 'Bangladesh', worldBankCode: 'BGD', currency: 'BDT', exchange_rate: 110 },
    IN: { name: 'India', worldBankCode: 'IND', currency: 'INR', exchange_rate: 83 },
    TH: { name: 'Thailand', worldBankCode: 'THA', currency: 'THB', exchange_rate: 34 }
  };
  
  const database = {};
  
  for (const [code, info] of Object.entries(countries)) {
    console.log(`Fetching ${info.name}...`);
    
    const [population, birthRate, deathRate, growthRate] = await Promise.all([
      fetchWorldBank(info.worldBankCode, 'SP.POP.TOTL'),
      fetchWorldBank(info.worldBankCode, 'SP.DYN.CBRT.IN'),
      fetchWorldBank(info.worldBankCode, 'SP.DYN.CDRT.IN'),
      fetchWorldBank(info.worldBankCode, 'SP.POP.GROW')
    ]);
    
    database[code] = {
      last_updated: new Date().toISOString(),
      demographics: {
        total_population: population,
        birth_rate_per_1000: birthRate,
        death_rate_per_1000: deathRate,
        population_growth_annual_pct: growthRate
      }
    };
  }
  
  fs.writeFileSync('database.json', JSON.stringify(database, null, 2));
  console.log('✅ database.json saved!');
}

updateAllCountries();
