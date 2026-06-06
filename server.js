const express = require('express');
const cors = require('cors');
const db = require('knex')({
    client: 'pg',
    connection: 'postgres://your_user:your_pass@localhost:5432/count_it'
});

const app = express();
app.use(cors());
app.use(express.json());

// Get all countries (for the grid)
app.get('/api/countries', async (req, res) => {
    const countries = await db('countries').select('*');
    res.json(countries);
});

// Get full country data (demographics + import categories)
app.get('/api/countries/:isoCode', async (req, res) => {
    const { isoCode } = req.params;
    
    const country = await db('countries').where({ iso_code: isoCode }).first();
    if (!country) return res.status(404).json({ error: 'Country not found' });
    
    const categories = await db('import_categories')
        .where({ country_id: country.country_id })
        .select('category_name', 'duty_pct', 'vat_pct', 'ait_pct');
    
    res.json({
        country: country.country_name,
        iso_code: country.iso_code,
        currency: country.currency_code,
        import_categories: categories.map(c => ({
            name: c.category_name,
            duty_pct: parseFloat(c.duty_pct),
            vat_pct: parseFloat(c.vat_pct),
            ait_pct: parseFloat(c.ait_pct)
        }))
    });
});

app.listen(3000, () => console.log('API running on port 3000'));
