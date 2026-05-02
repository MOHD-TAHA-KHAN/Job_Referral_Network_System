import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🚀 Starting Integration Tests...');
  
  let hrToken = '';
  let fresherToken = '';
  let hrId = '';
  let jobId = '';
  let referralId = '';

  const hrEmail = `hr_${Date.now()}@test.com`;
  const fresherEmail = `fresher_${Date.now()}@test.com`;

  try {
    // 1. Register HR
    console.log('\n[1] Registering HR...');
    const hrRegister = await axios.post(`${API_URL}/auth/register`, {
      name: 'HR Manager',
      email: hrEmail,
      password: 'password123',
      role: 'HR',
      company: 'Tech Corp',
      domain: 'Engineering',
      skills: ['Recruiting', 'JavaScript']
    });
    console.log('✅ HR Registered:', hrRegister.data.user.id);
    hrId = hrRegister.data.user.id;

    // 2. Login HR
    console.log('\n[2] Logging in HR...');
    const hrLogin = await axios.post(`${API_URL}/auth/login`, {
      email: hrEmail,
      password: 'password123'
    });
    hrToken = hrLogin.data.accessToken;
    console.log('✅ HR Logged in. Token received.');

    // 3. Create Job
    console.log('\n[3] Creating Job...');
    const jobRes = await axios.post(`${API_URL}/jobs`, {
      title: 'Senior Frontend Developer',
      description: 'Looking for an experienced React developer.',
      company: 'Tech Corp',
      location: 'Remote',
      requiredSkills: ['React', 'TypeScript'],
      domain: 'Engineering',
      experienceLevel: 'SENIOR',
      jobType: 'FULL_TIME'
    }, { headers: { Authorization: `Bearer ${hrToken}` } });
    jobId = jobRes.data.job.id;
    console.log('✅ Job created:', jobId);

    // 4. Register Fresher
    console.log('\n[4] Registering Fresher...');
    const fresherRegister = await axios.post(`${API_URL}/auth/register`, {
      name: 'Fresher User',
      email: fresherEmail,
      password: 'password123',
      role: 'FRESHER',
      skills: ['React', 'TypeScript', 'Node.js']
    });
    console.log('✅ Fresher Registered');

    // 5. Login Fresher
    console.log('\n[5] Logging in Fresher...');
    const fresherLogin = await axios.post(`${API_URL}/auth/login`, {
      email: fresherEmail,
      password: 'password123'
    });
    fresherToken = fresherLogin.data.accessToken;
    console.log('✅ Fresher Logged in.');

    // 6. Get Matches for Job
    console.log('\n[6] Getting Matches for Job...');
    const matchesRes = await axios.get(`${API_URL}/match/${jobId}`, {
      headers: { Authorization: `Bearer ${fresherToken}` }
    });
    console.log(`✅ Matches found: ${matchesRes.data.matches.length}`);
    if (matchesRes.data.matches.length > 0) {
      console.log(`   Top Match: ${matchesRes.data.matches[0].name} (Score: ${matchesRes.data.matches[0].matchScore})`);
    } else {
      console.log('   ⚠️ WARNING: No matches found. (Expected HR to match)');
    }

    // 7. Send Referral Request
    console.log('\n[7] Sending Referral Request...');
    const referralRes = await axios.post(`${API_URL}/referrals`, {
      jobId,
      referrerId: hrId,
      message: 'Please refer me!'
    }, { headers: { Authorization: `Bearer ${fresherToken}` } });
    referralId = referralRes.data.referral.id;
    console.log('✅ Referral Request Sent:', referralId);

    // 8. View Received Referrals (as HR)
    console.log('\n[8] Viewing Received Referrals (HR)...');
    const receivedRes = await axios.get(`${API_URL}/referrals/my-referrals?type=received`, {
      headers: { Authorization: `Bearer ${hrToken}` }
    });
    console.log(`✅ HR received ${receivedRes.data.referrals.length} referral(s)`);

    // 9. Accept Referral
    console.log('\n[9] Accepting Referral...');
    const acceptRes = await axios.patch(`${API_URL}/referrals/${referralId}/status`, {
      status: 'ACCEPTED',
      responseMessage: 'Looks good!'
    }, { headers: { Authorization: `Bearer ${hrToken}` } });
    console.log('✅ Referral Accepted! Final Status:', acceptRes.data.referral.status);

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The flow is working perfectly.');

  } catch (error: any) {
    console.error('\n❌ TEST FAILED!');
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

runTests();
