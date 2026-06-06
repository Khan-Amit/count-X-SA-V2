const fs = require('fs');
const db = require('knex')({
    client: 'pg',
    connection: 'postgres://your_user:your_pass@localhost:5432/count_it'
});

async function importCountry(fileName) {
    const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    
    await db.transaction(async trx => {
        // Insert or get country
        let country = await trx('countries').where({ iso_code: data.iso_code }).first();
        if (!country) {
            [country] = await trx('countries').insert({
                iso_code: data.iso_code,
                country_name: data.country,
                currency_code: data.currency
            }).returning('*');
        }
        
        // Insert categories
        for (const cat of data.import_categories) {
            await trx('import_categories').insert({
                country_id: country.country_id,
                category_name: cat.name,
                duty_pct: cat.duty_pct,
                vat_pct: cat.vat_pct,
                ait_pct: cat.ait_pct || 0
            }).onConflict(['country_id', 'category_name']).merge();
        }
    });
    
    console.log(`Imported ${data.country}`);
}

async function run() {
    await importCountry('BD.json');
    await importCountry('IN.json');
    await importCountry('TH.json');
    console.log('Done');
    process.exit();
}

run();
