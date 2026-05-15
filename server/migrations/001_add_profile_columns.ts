import { sequelize } from '../config/db';

async function migrate() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Adding columns to users table...');

    const columns = [
      { name: 'bio', type: 'TEXT' },
      { name: 'position', type: 'VARCHAR(255)' },
      { name: 'education', type: 'VARCHAR(255)' },
      { name: 'linkedin_url', type: 'VARCHAR(500)' },
    ];

    for (const col of columns) {
      try {
        await sequelize.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type};`);
        console.log(`Added column ${col.name}`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`Column ${col.name} already exists. Skipping.`);
        } else {
          console.error(`Error adding column ${col.name}:`, err.message);
        }
      }
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

migrate();
