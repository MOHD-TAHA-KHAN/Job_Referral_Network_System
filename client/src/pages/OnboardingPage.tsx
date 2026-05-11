import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { profileService } from '../services/profileService';
import '@/styles/Frame2209.css';
import '@/styles/auth.css';
import '@/styles/onboarding.css';

const SKILLS_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'C++', 'SQL', 'MongoDB', 'AWS', 'Docker', 'System Design', 'GCP', 'Azure',
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [education, setEducation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleFinish = async () => {
    setSaving(true);
    setError('');
    try {
      await profileService.updateProfile({
        bio,
        company,
        position,
        education,
        skills: selectedSkills,
        linkedinUrl,
      });
      navigate('/dashboard');
    } catch {
      setError('Failed to save profile. You can update it later from your profile page.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container onboarding-container">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <div className="logo-bar"></div>
            <div className="logo-bar"></div>
            <div className="logo-bar"></div>
          </div>
          <span className="auth-logo-text">RefNet</span>
        </div>

        <div className="auth-card onboarding-card">
          {/* Progress */}
          <div className="onboarding-progress">
            {[1, 2, 3].map(s => (
              <div key={s} className={`onboarding-step ${step >= s ? 'done' : ''}`}>
                <div className="onboarding-step-dot">{step > s ? '✓' : s}</div>
                <span>{s === 1 ? 'About You' : s === 2 ? 'Skills' : 'Links'}</span>
              </div>
            ))}
          </div>

          <h1 className="auth-title">
            {step === 1 ? `Welcome, ${user?.name?.split(' ')[0] ?? 'there'} 👋` : step === 2 ? 'Your Skills' : 'Connect Your Profiles'}
          </h1>
          <p className="auth-subtitle">
            {step === 1 ? 'Tell us a bit about yourself to get better referral matches.'
              : step === 2 ? 'Select skills to help referrers understand your background.'
              : 'Add your LinkedIn or GitHub to strengthen your profile.'}
          </p>

          {error && <div className="auth-error">{error}</div>}

          {step === 1 && (
            <div className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Bio (optional)</label>
                <textarea
                  className="auth-input profile-textarea"
                  placeholder="A short intro about yourself…"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Current / Target Company</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Google, Infosys"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Role / Position</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Software Engineer, Fresher"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Education</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. B.Tech CSE · IIT Delhi · 2024"
                  value={education}
                  onChange={e => setEducation(e.target.value)}
                />
              </div>
              <button className="auth-btn-primary" onClick={() => setStep(2)}>
                Next →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="auth-form">
              <div className="skills-grid">
                {SKILLS_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    className={`skill-chip ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="onboarding-nav">
                <button className="inbox-btn outline" onClick={() => setStep(1)}>← Back</button>
                <button className="auth-btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="auth-form">
              <div className="auth-field">
                <label className="auth-label">LinkedIn URL (optional)</label>
                <input
                  type="url"
                  className="auth-input"
                  placeholder="https://linkedin.com/in/yourname"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                />
              </div>
              <div className="onboarding-nav">
                <button className="inbox-btn outline" onClick={() => setStep(2)}>← Back</button>
                <button
                  className="auth-btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleFinish}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Go to Dashboard →'}
                </button>
              </div>
              <button
                className="auth-footer"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '13px' }}
                onClick={() => navigate('/dashboard')}
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
