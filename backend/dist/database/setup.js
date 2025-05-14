"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const fs = require("fs");
const path = require("path");
async function setupDatabase() {
    const pool = new pg_1.Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'tiki_resto',
    });
    try {
        const migration = fs.readFileSync(path.join(__dirname, 'migrations', 'create-users-table.sql'), 'utf8');
        await pool.query(migration);
        console.log('Migration réussie : La table users a été créée/mise à jour');
    }
    catch (error) {
        console.error('Erreur lors de la migration :', error);
    }
    finally {
        await pool.end();
    }
}
setupDatabase();
//# sourceMappingURL=setup.js.map