const fs = require('fs');

async function fetchWorldBank(countryCode, indicator) {
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[1]?.[0]?.value || null;
  } catch (e) {
    console.error(`Error fetching ${indicator}:`, e);
    return null;
  }
}

async function updateDatabase() {
  const countries = {
    BD: { code: 'BGD', name: 'Bangladesh' },
    IN: { code: 'IND', name: 'India' },
    TH: { code: 'THA', name: 'Thailand' },
    CA: { code: 'CAN', name: 'Canada' }
  };
  
  const database = {};
  
  for (const [key, info] of Object.entries(countries)) {
    console.log(`Fetching ${info.name}...`);
    
    const population = await fetchWorldBank(info.code, 'SP.POP.TOTL');
    const birthRate = await fetchWorldBank(info.code, 'SP.DYN.CBRT.IN');
    const deathRate = await fetchWorldBank(info.code, 'SP.DYN.CDRT.IN');
    const growthRate = await fetchWorldBank(info.code, 'SP.POP.GROW');
    
    database[key] = {
      last_updated: new Date().toISOString(),
      demographics: {
        total_population: population,
        birth_rate_per_1000: birthRate,
        death_rate_per_1000: deathRate,
        population_growth_annual_pct: growthRate
      }
    };
    
    console.log(`✅ ${info.name}: Population ${population?.toLocaleString()}`);
  }
  
  fs.writeFileSync('database.json', JSON.stringify(database, null, 2));
  console.log('\n✅ database.json saved successfully!');
}

updateDatabase();
