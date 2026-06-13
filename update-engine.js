const fs = require('fs');

async function fetchWorldBank(countryCode, indicator) {
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[1]?.[0]?.value || null;
  } catch (err) {
    console.error(`API error for ${indicator}:`, err.message);
    return null;
  }
}

async function updateDatabase() {
  console.log('🔄 Updating database from live APIs...');
  const db = JSON.parse(fs.readFileSync('database.json', 'utf8'));

  const wbCodes = { BD: 'BGD', IN: 'IND', TH: 'THA', CA: 'CAN' };
  for (const [code, wbCode] of Object.entries(wbCodes)) {
    console.log(`📡 Fetching ${db[code].country}...`);
    const population = await fetchWorldBank(wbCode, 'SP.POP.TOTL');
    const growth = await fetchWorldBank(wbCode, 'SP.POP.GROW');
    const birth = await fetchWorldBank(wbCode, 'SP.DYN.CBRT.IN');
    const death = await fetchWorldBank(wbCode, 'SP.DYN.CDRT.IN');

    if (population) db[code].demographics.total_population = population;
    if (growth) db[code].demographics.population_growth_annual_pct = growth;
    if (birth) db[code].demographics.birth_rate_per_1000 = birth;
    if (death) db[code].demographics.death_rate_per_1000 = death;

    db[code].last_updated = new Date().toISOString();
  }

  fs.writeFileSync('database.json', JSON.stringify(db, null, 2));
  console.log('✅ Database update complete.');
}

updateDatabase().catch(console.error);
