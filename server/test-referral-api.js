const axios = require('axios')

const API_BASE = 'http://localhost:5000/api'

// Test data
const testFresher = {
  name: 'Test Fresher',
  email: 'fresher@example.com',
  password: 'password123',
  role: 'FRESHER'
}

const testProfessional = {
  name: 'Test Professional',
  email: 'pro@example.com',
  password: 'password123',
  role: 'PROFESSIONAL',
  company: 'Tech Corp',
  domain: 'Software Development'
}

const testHR = {
  name: 'Test HR',
  email: 'hr2@example.com',
  password: 'password123',
  role: 'HR',
  company: 'Another Corp'
}

const testJob = {
  title: 'Senior Developer',
  description: 'Looking for experienced developer',
  company: 'Tech Corp',
  location: 'Bangalore',
  requiredSkills: ['JavaScript', 'React', 'Node.js'],
  domain: 'Software Development',
  salaryMin: 800000,
  salaryMax: 1500000
}

let fresherToken = ''
let proToken = ''
let hrToken = ''
let jobId = ''
let referralId = ''

const testReferralAPI = async () => {
  try {
    console.log('🚀 Starting Referral API Tests...\n')

    // 1. Register test users
    console.log('1️⃣ Registering test users...')

    const fresherRes = await axios.post(`${API_BASE}/auth/register`, testFresher)
    fresherToken = fresherRes.data.accessToken
    console.log('✅ Fresher registered')

    const proRes = await axios.post(`${API_BASE}/auth/register`, testProfessional)
    proToken = proRes.data.accessToken
    console.log('✅ Professional registered')

    const hrRes = await axios.post(`${API_BASE}/auth/register`, testHR)
    hrToken = hrRes.data.accessToken
    console.log('✅ HR registered\n')

    // Set authorization headers
    const fresherAuth = { Authorization: `Bearer ${fresherToken}` }
    const proAuth = { Authorization: `Bearer ${proToken}` }
    const hrAuth = { Authorization: `Bearer ${hrToken}` }

    // 2. Create a job (HR)
    console.log('2️⃣ Creating a job...')
    const jobRes = await axios.post(`${API_BASE}/jobs`, testJob, { headers: hrAuth })
    jobId = jobRes.data.job.id
    console.log('✅ Job created:', jobId, '\n')

    // 3. Create referral request (Fresher to Professional)
    console.log('3️⃣ Creating referral request...')
    const referralData = {
      jobId,
      referrerId: proRes.data.user.id, // Professional's ID
      message: 'I would appreciate your referral for this position'
    }

    const referralRes = await axios.post(`${API_BASE}/referrals`, referralData, { headers: fresherAuth })
    referralId = referralRes.data.referral.id
    console.log('✅ Referral created:', referralId)
    console.log('   Status:', referralRes.data.referral.status, '\n')

    // 4. Get freshers referrals (sent)
    console.log('4️⃣ Getting fresher\'s sent referrals...')
    const sentRes = await axios.get(`${API_BASE}/referrals/my-referrals?type=sent`, { headers: fresherAuth })
    console.log('✅ Fresher has', sentRes.data.referrals.length, 'sent referrals\n')

    // 5. Get professional's referrals (received)
    console.log('5️⃣ Getting professional\'s received referrals...')
    const receivedRes = await axios.get(`${API_BASE}/referrals/my-referrals?type=received`, { headers: proAuth })
    console.log('✅ Professional has', receivedRes.data.referrals.length, 'received referrals\n')

    // 6. Get specific referral details
    console.log('6️⃣ Getting referral details...')
    const detailRes = await axios.get(`${API_BASE}/referrals/${referralId}`, { headers: fresherAuth })
    console.log('✅ Referral details:')
    console.log('   Job:', detailRes.data.referral.job.title)
    console.log('   From:', detailRes.data.referral.requester.name)
    console.log('   To:', detailRes.data.referral.referrer.name)
    console.log('   Status:', detailRes.data.referral.status, '\n')

    // 7. Accept referral (Professional)
    console.log('7️⃣ Professional accepting referral...')
    const acceptData = {
      status: 'ACCEPTED',
      responseMessage: 'I\'d be happy to refer you for this position!'
    }
    const acceptRes = await axios.patch(`${API_BASE}/referrals/${referralId}/status`, acceptData, { headers: proAuth })
    console.log('✅ Referral accepted:', acceptRes.data.referral.status, '\n')

    // 8. Complete referral (Professional)
    console.log('8️⃣ Professional marking referral as completed...')
    const completeData = {
      status: 'COMPLETED',
      responseMessage: 'Referral submitted successfully!'
    }
    const completeRes = await axios.patch(`${API_BASE}/referrals/${referralId}/status`, completeData, { headers: proAuth })
    console.log('✅ Referral completed:', completeRes.data.referral.status, '\n')

    // 9. Get referrals for job (HR view)
    console.log('9️⃣ Getting referrals for job (HR view)...')
    const jobReferralsRes = await axios.get(`${API_BASE}/referrals/job/${jobId}`, { headers: hrAuth })
    console.log('✅ Job has', jobReferralsRes.data.referrals.length, 'referrals\n')

    // 10. Test rejection scenario
    console.log('🔟 Testing rejection scenario...')

    // Create another referral
    const referralData2 = {
      jobId,
      referrerId: proRes.data.user.id,
      message: 'Another referral request'
    }

    const referralRes2 = await axios.post(`${API_BASE}/referrals`, referralData2, { headers: fresherAuth })
    const referralId2 = referralRes2.data.referral.id
    console.log('✅ Second referral created')

    // Reject it
    const rejectData = {
      status: 'REJECTED',
      responseMessage: 'Sorry, I cannot refer you at this time.'
    }
    const rejectRes = await axios.patch(`${API_BASE}/referrals/${referralId2}/status`, rejectData, { headers: proAuth })
    console.log('✅ Second referral rejected:', rejectRes.data.referral.status, '\n')

    // 11. Test duplicate prevention
    console.log('1️⃣1️⃣ Testing duplicate referral prevention...')
    try {
      await axios.post(`${API_BASE}/referrals`, referralData, { headers: fresherAuth })
      console.log('❌ Should have prevented duplicate')
    } catch (err) {
      if (err.response?.status === 400) {
        console.log('✅ Duplicate referral correctly prevented\n')
      } else {
        throw err
      }
    }

    console.log('🎉 All Referral API tests passed! ✅')

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message)
    if (error.response?.status) {
      console.error('Status code:', error.response.status)
    }
  }
}

// Run tests
testReferralAPI()