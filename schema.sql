-- Create database
CREATE DATABASE count_it;

-- Connect to it, then run:

CREATE TABLE countries (
    country_id SERIAL PRIMARY KEY,
    iso_code VARCHAR(3) UNIQUE NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE import_categories (
    category_id SERIAL PRIMARY KEY,
    country_id INT REFERENCES countries(country_id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    duty_pct DECIMAL(5,2) NOT NULL,
    vat_pct DECIMAL(5,2) NOT NULL,
    ait_pct DECIMAL(5,2) DEFAULT 0,
    UNIQUE(country_id, category_name)
);
