require('dotenv').config()
import { Sequelize } from 'sequelize';

console.log('Connecting to PostgreSQL:', process.env.PG_URI)

const pgUri = process.env.PG_URI;

if (!pgUri) {
  console.error('FATAL ERROR: PG_URI is not defined in environment variables.');
  process.exit(1);
}

const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000
  }
})

const connectPostgres = async () => {
  let retries = 10
  while (retries) {
    try {
      // Initialize model associations BEFORE authenticate/sync
      const User = (await import('../models/pg/user')).default;
      const Job = (await import('../models/pg/job')).default;
      const Referral = (await import('../models/pg/referral')).default;
      const Experience = (await import('../models/pg/experience')).default;
      const Project = (await import('../models/pg/project')).default;

      // Set up associations
      (User as any).associate({ Job, Referral, Experience, Project });
      (Job as any).associate({ User, Referral });
      (Referral as any).associate({ Job, User });
      (Experience as any).associate({ User });
      (Project as any).associate({ User });

      await sequelize.authenticate()
      await sequelize.sync({ alter: true })

      console.log('PostgreSQL connected successfully!')
      break
    } catch (err: any) {
      retries -= 1
      console.log(`PostgreSQL not ready yet... retrying (${retries} left)`)
      if (retries === 0) {
        console.error('❌ PostgreSQL connection failed after 10 retries.')
        console.error('ERROR:', err.message)
        console.error('\n💡 Troubleshooting Tips:')
        console.error('1. Ensure PostgreSQL is running.')
        console.error(`2. Check if it\'s listening on ${process.env.PG_URI?.split('@')[1].split('/')[0]}`)
        console.error('3. Verify credentials in your .env file.')
        process.exit(1)
      }
      await new Promise(res => setTimeout(res, 5000))
    }
  }
}

export { sequelize, connectPostgres  };