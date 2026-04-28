// @ts-nocheck
import {  connectPostgres  } from './config/db';
import User from './models/pg/user';
import Job from './models/pg/job';

const testJobModel = async () => {
  try {
    // Connect to database
    await connectPostgres()

    console.log('✅ Database connected successfully!')

    // Test creating a sample HR user
    const hrUser = await User.create({
      name: 'John HR',
      email: 'hr@company.com',
      password: 'hashedpassword',
      role: 'HR',
      company: 'Tech Corp'
    })

    console.log('✅ HR User created:', hrUser.id)

    // Test creating a job
    const job = await Job.create({
      title: 'Senior Software Engineer',
      description: 'We are looking for a senior software engineer with 5+ years of experience...',
      company: 'Tech Corp',
      location: 'Bangalore',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
      domain: 'Software Development',
      salaryMin: 1200000,
      salaryMax: 2000000,
      createdBy: hrUser.id
    })

    console.log('✅ Job created:', job.id)

    // Test fetching job with creator
    const jobWithCreator = await Job.findByPk(job.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email', 'role', 'company']
      }]
    })

    console.log('✅ Job with creator:', {
      title: jobWithCreator.title,
      company: jobWithCreator.company,
      creator: jobWithCreator.creator.name,
      creatorRole: jobWithCreator.creator.role
    })

    // Test fetching jobs created by HR
    const hrJobs = await User.findByPk(hrUser.id, {
      include: [{
        model: Job,
        as: 'createdJobs',
        attributes: ['id', 'title', 'company', 'location']
      }]
    })

    console.log('✅ HR created jobs:', hrJobs.createdJobs.map(j => j.title))

    console.log('🎉 All Job model tests passed!')

  } catch (error: any) {
    console.error('❌ Test failed:', error.message)
  } finally {
    process.exit(0)
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testJobModel()
}

export { testJobModel  };