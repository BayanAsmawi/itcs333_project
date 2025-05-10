// This is a simple migration script to run the drizzle migrations
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Check that Database URL is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Create postgres client
const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(sql);

// Run migrations
async function runMigrations() {
  console.log('Running migrations...');
  
  try {
    await migrate(db, { migrationsFolder: 'migrations' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigrations();