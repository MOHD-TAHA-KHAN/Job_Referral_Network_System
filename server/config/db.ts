require('dotenv').config()
import { Sequelize } from 'sequelize';

console.log('Connecting to PostgreSQL:', process.env.PG_URI)

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

      // Set up associations
      (User as any).associate({ Job, Referral });
      (Job as any).associate({ User, Referral });
      (Referral as any).associate({ Job, User });

      await sequelize.authenticate()
      await sequelize.sync({ alter: true })

      console.log('PostgreSQL connected successfully!')
      break
    } catch (err: any) {
      retries -= 1
      console.log(`PostgreSQL not ready yet... retrying (${retries} left)`)
      if (retries === 0) {
        console.error('PostgreSQL connection failed:', err.message)
        process.exit(1)
      }
      await new Promise(res => setTimeout(res, 5000))
    }
  }
}

export { sequelize, connectPostgres  };