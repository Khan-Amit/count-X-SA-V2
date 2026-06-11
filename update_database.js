// Run with: node update_database.js
const fs = require('fs');

async function fetchAPI(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data[1]?.[0]?.value || null;
}

async function update() {
  const countries = { BD: 'BGD', IN: 'IND', TH: 'THA' };
  const database = {};
  
  for (const [code, wbCode] of Object.entries(countries)) {
    console.log(`Fetching ${code}...`);
    database[code] = {
      demographics: {
        population: await fetchAPI(`https://api.worldbank.org/v2/country/${wbCode}/indicator/SP.POP.TOTL?format=json`),
        birth_rate: await fetchAPI(`https://api.worldbank.org/v2/country/${wbCode}/indicator/SP.DYN.CBRT.IN?format=json`),
        death_rate: await fetchAPI(`https://api.worldbank.org/v2/country/${wbCode}/indicator/SP.DYN.CDRT.IN?format=json`),
        growth: await fetchAPI(`https://api.worldbank.org/v2/country/${wbCode}/indicator/SP.POP.GROW?format=json`)
      },
      last_updated: new Date().toISOString()
    };
  }
  
  fs.writeFileSync('database.json', JSON.stringify(database, null, 2));
  console.log('✅ database.json saved!');
}

update();
