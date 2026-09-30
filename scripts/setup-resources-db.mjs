import { createClient } from '@vercel/postgres';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Use direct connection for script
const db = createClient({
  connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL,
});

async function setupDatabase() {
  try {
    console.log('🚀 Setting up resources database...\n');

    // Connect to database
    await db.connect();

    // Read the SQL file
    const sqlContent = await readFile(
      resolve(__dirname, '../lib/db/resources.sql'),
      'utf-8'
    );

    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await db.query(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      } catch (error) {
        // Ignore "already exists" errors
        if (error.message && error.message.includes('already exists')) {
          console.log('⚠️  Table already exists, skipping creation');
        } else {
          throw error;
        }
      }
    }

    // Verify the data
    const result = await db.query('SELECT COUNT(*) as count FROM resources');
    console.log(`\n✅ Database setup complete! ${result.rows[0].count} resources loaded.`);

    // Close connection
    await db.end();
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    await db.end();
    process.exit(1);
  }
}

setupDatabase();
