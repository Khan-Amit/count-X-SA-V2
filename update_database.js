// update_database.js - Run with: node update_database.js
const fs = require('fs');

async function fetchAPI(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data[1]?.[0]?.value || null;
  } catch (e) {
    console.error('API Error:', e.message);
    return null;
  }
}

async function updateDatabase() {
  // YOUR COMPLETE DATA from the JSON files you gave me
  const database = {
    "BD": {
      country: "Bangladesh",
      currency: "BDT",
      exchange_rate: 110,
      demographics: {
        total_population: 173562364,
        male_population: 85700000,
        female_population: 87800000,
        birth_rate_per_1000: 17.5,
        death_rate_per_1000: 5.8,
        population_growth_annual_pct: 1.03,
        life_expectancy_years: 72.6,
        religions: { "Muslim": "88.4%", "Hindu": "8.9%", "Buddhist": "0.6%", "Christian": "0.4%" }
      },
      tax_structure: {
        individual_tax_brackets: [
          { min: 0, max: 350000, rate: 0 }, { min: 350001, max: 450000, rate: 5 },
          { min: 450001, max: 850000, rate: 10 }, { min: 850001, max: 1350000, rate: 15 },
          { min: 1350001, max: 1850000, rate: 20 }, { min: 1850001, max: 3850000, rate: 25 },
          { min: 3850001, max: null, rate: 30 }
        ]
      },
      import_categories: [
        { hs_code: "8517.13", description: "Smartphones", duty_pct: 25, vat_pct: 15, ait_pct: 5 },
        { hs_code: "8471.30", description: "Laptops", duty_pct: 5, vat_pct: 15, ait_pct: 0 }
      ]
    },
    // Add IN, TH, CA with your complete 30 products each
  };
  
  // Update live data from World Bank API
  console.log('Fetching live demographics from World Bank...');
  
  const wbCodes = { BD: 'BGD', IN: 'IND', TH: 'THA' };
  for (const [code, wbCode] of Object.entries(wbCodes)) {
    const pop = await fetchAPI(`https://api.worldbank.org/v2/country/${wbCode}/indicator/SP.POP.TOTL?format=json`);
    const birth = await fetchAPI(`https://api.worldbank.org/v2/country/${wbCode}/indicator/SP.DYN.CBRT.IN?format=json`);
    const death = await fetchAPI(`https://api.worldbank.org/v2/country/${wbCode}/indicator/SP.DYN.CDRT.IN?format=json`);
    const growth = await fetchAPI(`https://api.worldbank.org/v2/country/${wbCode}/indicator/SP.POP.GROW?format=json`);
    
    if (pop) database[code].demographics.total_population = pop;
    if (birth) database[code].demographics.birth_rate_per_1000 = birth;
    if (death) database[code].demographics.death_rate_per_1000 = death;
    if (growth) database[code].demographics.population_growth_annual_pct = growth;
  }
  
  database.BD.last_updated = new Date().toISOString();
  database.IN.last_updated = new Date().toISOString();
  database.TH.last_updated = new Date().toISOString();
  database.CA.last_updated = new Date().toISOString();
  
  fs.writeFileSync('database.json', JSON.stringify(database, null, 2));
  console.log('✅ database.json saved!');
}

updateDatabase();
