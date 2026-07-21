import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);
async function runMigrations() {
    try {
        await migrate(db, { migrationsFolder: './drizzle',migrationsSchema: './src/server/db/schema.ts' });
        console.log('✅ Migrations applied successfully!');
    } catch (error) {
        console.error('❌ Migration failed:');
       
        console.error(error);
    } finally {
        await pool.end(); 
    }
}

runMigrations();