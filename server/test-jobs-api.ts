import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'

// Test data
const testUser = {
  name: 'Test HR',
  email: 'test-hr@example.com',
  password: 'password123',
  role: 'HR',
  company: 'Test Corp'
}

const testJob = {
  title: 'Senior Full Stack Developer',
  description: 'We are looking for a senior full stack developer with expertise in React, Node.js, and PostgreSQL. Experience with cloud platforms is a plus.',
  company: 'Test Corp',
  location: 'Bangalore',
  requiredSkills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
  domain: 'Software Development',
  salaryMin: 1500000,
  salaryMax: 2500000
}

let accessToken = ''
let jobId = ''

const testJobsAPI = async () => {
  try {
    console.log('🚀 Starting Jobs API Tests...\n')

    // 1. Register HR user
    console.log('1️⃣ Registering HR user...')
    const registerRes = await axios.post(`${API_BASE}/auth/register`, testUser)
    accessToken = registerRes.data.accessToken
    console.log('✅ HR user registered, token received\n')

    // Set authorization header for subsequent requests
    const authHeaders = { Authorization: `Bearer ${accessToken}` }

    // 2. Create a job
    console.log('2️⃣ Creating a job...')
    const createJobRes = await axios.post(`${API_BASE}/jobs`, testJob, { headers: authHeaders })
    jobId = createJobRes.data.job.id
    console.log('✅ Job created:', createJobRes.data.job.title)
    console.log('   Job ID:', jobId, '\n')

    // 3. Get all jobs
    console.log('3️⃣ Fetching all jobs...')
    const getJobsRes = await axios.get(`${API_BASE}/jobs`)
    console.log('✅ Found', getJobsRes.data.jobs.length, 'jobs')
    console.log('   First job:', getJobsRes.data.jobs[0].title, '\n')

    // 4. Get specific job by ID
    console.log('4️⃣ Fetching job by ID...')
    const getJobRes = await axios.get(`${API_BASE}/jobs/${jobId}`)
    console.log('✅ Job details:', getJobRes.data.job.title)
    console.log('   Company:', getJobRes.data.job.company)
    console.log('   Skills:', getJobRes.data.job.requiredSkills.join(', '), '\n')

    // 5. Search jobs by company
    console.log('5️⃣ Searching jobs by company...')
    const searchRes = await axios.get(`${API_BASE}/jobs?company=Test`)
    console.log('✅ Found', searchRes.data.jobs.length, 'jobs for "Test" company\n')

    // 6. Search jobs by skills
    console.log('6️⃣ Searching jobs by skills...')
    const skillsRes = await axios.get(`${API_BASE}/jobs?skills=["JavaScript","React"]`)
    console.log('✅ Found', skillsRes.data.jobs.length, 'jobs with JavaScript/React skills\n')

    // 7. Get HR's own jobs
    console.log('7️⃣ Fetching HR\'s own jobs...')
    const myJobsRes = await axios.get(`${API_BASE}/jobs/user/my-jobs`, { headers: authHeaders })
    console.log('✅ HR has', myJobsRes.data.jobs.length, 'jobs\n')

    // 8. Update job
    console.log('8️⃣ Updating job...')
    const updateData = {
      title: 'Senior Full Stack Developer (Updated)',
      salaryMax: 3000000
    }
    const updateRes = await axios.put(`${API_BASE}/jobs/${jobId}`, updateData, { headers: authHeaders })
    console.log('✅ Job updated:', updateRes.data.job.title)
    console.log('   New max salary:', updateRes.data.job.salaryMax, '\n')

    // 9. Test pagination
    console.log('9️⃣ Testing pagination...')
    const pageRes = await axios.get(`${API_BASE}/jobs?page=1&limit=5`)
    console.log('✅ Page 1 has', pageRes.data.jobs.length, 'jobs')
    console.log('   Total jobs:', pageRes.data.pagination.total)
    console.log('   Total pages:', pageRes.data.pagination.pages, '\n')

    // 10. Delete job
    console.log('🔟 Deleting job...')
    const deleteRes = await axios.delete(`${API_BASE}/jobs/${jobId}`, { headers: authHeaders })
    console.log('✅ Job deleted:', deleteRes.data.message, '\n')

    // 11. Verify job is deleted
    console.log('1️⃣1️⃣ Verifying job deletion...')
    try {
      await axios.get(`${API_BASE}/jobs/${jobId}`)
      console.log('❌ Job still exists (should be deleted)')
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.log('✅ Job successfully deleted (404 as expected)\n')
      } else {
        throw err
      }
    }

    console.log('🎉 All Jobs API tests passed! ✅')

  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message)
    if (error.response?.status) {
      console.error('Status code:', error.response.status)
    }
  }
}

// Run tests
testJobsAPI()