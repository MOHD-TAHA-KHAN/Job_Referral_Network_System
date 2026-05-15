import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { profileService, type Profile as ProfileData, type Experience, type Project } from '../services/profileService';
import AppSidebar from '../components/AppSidebar';
import '../styles/design-system.css';

const DashIcon = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>;
const UserIcon = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6H2z"/></svg>;
const DocIcon = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M4 1h6l4 4v10H2V1h2zm6 0v4h4"/></svg>;

const NAV = [
  { path: '/dashboard', label: 'Dashboard',  icon: <DashIcon /> },
  { path: '/profile',   label: 'My Profile', icon: <UserIcon /> },
  { path: '/profile',   label: 'Resume',     icon: <DocIcon /> },
];

const DEFAULT_PROFILE: Partial<ProfileData> = {
  bio: 'Add a bio to let others know more about you.',
  position: 'Your Position / Role',
  skills: [],
  education: 'Your Education',
  resumeUrl: 'No resume uploaded',
};

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ProfileData>>({});
  const [toast, setToast] = useState('');
  
  // Modal states
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showEditExperience, setShowEditExperience] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [addProjectMode, setAddProjectMode] = useState<'manual' | 'github'>('manual');
  
  // Form states for new items
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({});
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({});
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getMyProfile();
      setProfile(data.profile);
      setExperiences(data.experiences);
      setProjects(data.projects);
      setEditData(data.profile);
    } catch {
      showToast('Failed to load profile from backend.');
    }
  };

  const handleSave = async () => {
    try {
      const updated = await profileService.updateProfile(editData);
      setProfile(updated);
      setEditing(false);
      showToast('Profile updated!');
    } catch {
      setEditing(false);
      showToast('Saved locally (backend offline).');
    }
  };

  const handleAddExperience = async () => {
    try {
      const exp = await profileService.createExperience(newExperience as Omit<Experience, 'id' | 'userId'>);
      setExperiences([exp, ...experiences]);
      setShowAddExperience(false);
      setNewExperience({});
      showToast('Experience added!');
    } catch {
      showToast('Failed to add experience');
    }
  };

  const handleAddProject = async () => {
    try {
      const proj = await profileService.createProject({
        ...newProject,
        isFromGithub: addProjectMode === 'github'
      } as Omit<Project, 'id' | 'userId'>);
      setProjects([proj, ...projects]);
      setShowAddProject(false);
      setNewProject({});
      setAddProjectMode('manual');
      showToast('Project added!');
    } catch {
      showToast('Failed to add project');
    }
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExperience(exp);
    setShowEditExperience(true);
  };

  const handleSaveEditExperience = async () => {
    if (!editingExperience) return;
    try {
      const updated = await profileService.updateExperience(editingExperience.id, editingExperience);
      setExperiences(experiences.map(exp => exp.id === updated.id ? updated : exp));
      setShowEditExperience(false);
      setEditingExperience(null);
      showToast('Experience updated!');
    } catch {
      showToast('Failed to update experience');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await profileService.deleteExperience(id);
      setExperiences(experiences.filter(exp => exp.id !== id));
      showToast('Experience deleted!');
    } catch {
      showToast('Failed to delete experience');
    }
  };

  const handleEditProject = (proj: Project) => {
    setEditingProject(proj);
    setShowEditProject(true);
  };

  const handleSaveEditProject = async () => {
    if (!editingProject) return;
    try {
      const updated = await profileService.updateProject(editingProject.id, editingProject);
      setProjects(projects.map(proj => proj.id === updated.id ? updated : proj));
      setShowEditProject(false);
      setEditingProject(null);
      showToast('Project updated!');
    } catch {
      showToast('Failed to update project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await profileService.deleteProject(id);
      setProjects(projects.filter(proj => proj.id !== id));
      showToast('Project deleted!');
    } catch {
      showToast('Failed to delete project');
    }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const p = profile ?? (user as unknown as ProfileData) ?? DEFAULT_PROFILE;

  return (
    <div className="app-shell">
      <AppSidebar items={NAV} />

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#fff', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, zIndex: 1000, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
          {toast}
        </div>
      )}

      <div className="app-main">
        <div className="page-header" style={{ paddingBottom: 20 }}>
          <h1 className="page-title">My Profile</h1>
          <div className="header-actions">
            <button className="btn btn-outline btn-sm">⬆ Share Profile</button>
            <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>✏ Edit Profile</button>
          </div>
        </div>

        <div className="page-body" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 20 }}>
          {/* Left column */}
          <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Profile card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24, color: '#4f6ef7', flexShrink: 0 }}>
                  {(user?.name ?? p.name ?? 'U')[0]}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{user?.name ?? p.name ?? 'Unknown User'}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{[p.position, p.education].filter(Boolean).join(' · ') || DEFAULT_PROFILE.position}</p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#10b981', fontWeight: 600 }}>Profile {editing ? '100' : '85'}% complete</p>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, marginBottom: 16 }}>
                <div style={{ height: '100%', width: '85%', background: '#10b981', borderRadius: 3 }} />
              </div>

              {/* Contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Contact &amp; Details</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>✉</span> {user?.email ?? p.email}
                </div>
                {p.company && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span>🏢</span> {p.company}
                  </div>
                )}
                {p.linkedinUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4f6ef7' }}>
                    <span>🔗</span> {p.linkedinUrl}
                  </div>
                )}
              </div>
            </div>

            {/* Skills card */}
            <div className="card">
              <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700 }}>Bio</p>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.bio ?? DEFAULT_PROFILE.bio}</p>
              
              <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700 }}>Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(p.skills ?? []).length > 0 ? p.skills?.map(s => <span key={s} className="chip">{s}</span>) : <span className="chip" style={{ background: 'transparent', border: '1px dashed #ccc' }}>No skills added</span>}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Resume card */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Resume</p>
                <button className="btn btn-outline btn-sm">⬆ Update Resume</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8 }}>
                <span style={{ fontSize: 24 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{p.resumeUrl ? p.resumeUrl.split('/').pop() : DEFAULT_PROFILE.resumeUrl}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>Uploaded Nov 26, 2024 · 1.2 MB</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm">⬇</button>
                  <button className="btn btn-outline btn-sm">👁</button>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Experience</p>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddExperience(true)}>+ Add Experience</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {experiences.length > 0 ? experiences.map((exp, i) => (
                  <div key={exp.id} style={{ display: 'flex', gap: 14 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? '#4f6ef7' : '#10b981', marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{exp.title} at {exp.company}</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            className="btn btn-outline btn-sm" 
                            style={{ padding: '4px 8px', fontSize: 12 }} 
                            onClick={() => handleEditExperience(exp)}
                          >
                            ✏
                          </button>
                          <button 
                            className="btn btn-outline btn-sm" 
                            style={{ padding: '4px 8px', fontSize: 12, color: '#ef4444', borderColor: '#ef4444' }} 
                            onClick={() => handleDeleteExperience(exp.id)}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                      <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--text-muted)' }}>
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' – '}
                        {exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                      </p>
                      {exp.description && (
                        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{exp.description}</p>
                      )}
                      {(exp.skills ?? []).map(t => <span key={t} className="chip" style={{ fontSize: 11 }}>{t}</span>)}
                    </div>
                  </div>
                )) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>No experience added yet</p>
                )}
              </div>
            </div>

            {/* Projects */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Projects</p>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddProject(true)}>+ Add Project</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {projects.length > 0 ? projects.map((proj, i) => (
                  <div key={proj.id} style={{ display: 'flex', gap: 14 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? '#4f6ef7' : '#10b981', marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{proj.title}</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            className="btn btn-outline btn-sm" 
                            style={{ padding: '4px 8px', fontSize: 12 }} 
                            onClick={() => handleEditProject(proj)}
                          >
                            ✏
                          </button>
                          <button 
                            className="btn btn-outline btn-sm" 
                            style={{ padding: '4px 8px', fontSize: 12, color: '#ef4444', borderColor: '#ef4444' }} 
                            onClick={() => handleDeleteProject(proj.id)}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                      {proj.startDate && (
                        <p style={{ margin: '2px 0 6px', fontSize: 11, color: 'var(--text-muted)' }}>
                          {new Date(proj.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {proj.endDate ? ` – ${new Date(proj.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
                        </p>
                      )}
                      {proj.description && (
                        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{proj.description}</p>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#4f6ef7', marginRight: 8 }}>GitHub</a>
                      )}
                      {proj.demoUrl && (
                        <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#4f6ef7' }}>Demo</a>
                      )}
                      {(proj.skills ?? []).map(t => <span key={t} className="chip" style={{ fontSize: 11, marginRight: 4 }}>{t}</span>)}
                    </div>
                  </div>
                )) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>No projects added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {editing && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Edit Profile</h3>
              {([
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'company', label: 'Company', type: 'text' },
                { key: 'position', label: 'Role / Position', type: 'text' },
                { key: 'education', label: 'Education', type: 'text' },
                { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
                { key: 'bio', label: 'Bio', type: 'textarea' },
              ] as { key: keyof ProfileData; label: string; type: string }[]).map(f => (
                <div key={f.key} className="form-field">
                  <label className="form-label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea className="form-textarea" value={(editData[f.key] as string) ?? ''} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} rows={3} />
                  ) : (
                    <input type={f.type} className="form-input" value={(editData[f.key] as string) ?? ''} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save Changes</button>
                <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Experience Modal */}
        {showAddExperience && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Add Experience</h3>
              {([
                { key: 'title', label: 'Job Title', type: 'text' },
                { key: 'company', label: 'Company', type: 'text' },
                { key: 'location', label: 'Location', type: 'text' },
                { key: 'startDate', label: 'Start Date', type: 'date' },
                { key: 'endDate', label: 'End Date (leave blank if current)', type: 'date' },
                { key: 'description', label: 'Description', type: 'textarea' },
              ] as { key: keyof Experience; label: string; type: string }[]).map(f => (
                <div key={f.key} className="form-field">
                  <label className="form-label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea className="form-textarea" value={(newExperience[f.key] as string) ?? ''} onChange={e => setNewExperience(p => ({ ...p, [f.key]: e.target.value }))} rows={3} />
                  ) : (
                    <input type={f.type} className="form-input" value={(newExperience[f.key] ? (f.type === 'date' ? new Date(newExperience[f.key] as Date).toISOString().split('T')[0] : (newExperience[f.key] as string)) : '')} onChange={e => setNewExperience(p => ({ ...p, [f.key]: f.type === 'date' ? new Date(e.target.value) : e.target.value }))} />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddExperience}>Add Experience</button>
                <button className="btn btn-outline" onClick={() => setShowAddExperience(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Project Modal */}
        {showAddProject && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Add Project</h3>
              
              {/* Project mode selector */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <button 
                  className={`btn ${addProjectMode === 'manual' ? 'btn-primary' : 'btn-outline'} btn-sm`} 
                  onClick={() => setAddProjectMode('manual')}
                >
                  Manual Entry
                </button>
                <button 
                  className={`btn ${addProjectMode === 'github' ? 'btn-primary' : 'btn-outline'} btn-sm`} 
                  onClick={() => setAddProjectMode('github')}
                >
                  From GitHub Link
                </button>
              </div>

              {addProjectMode === 'manual' ? (
                <>
                  {([
                    { key: 'title', label: 'Project Title', type: 'text' },
                    { key: 'description', label: 'Description', type: 'textarea' },
                    { key: 'startDate', label: 'Start Date', type: 'date' },
                    { key: 'endDate', label: 'End Date', type: 'date' },
                    { key: 'githubUrl', label: 'GitHub URL', type: 'url' },
                    { key: 'demoUrl', label: 'Demo URL', type: 'url' },
                  ] as { key: keyof Project; label: string; type: string }[]).map(f => (
                    <div key={f.key} className="form-field">
                      <label className="form-label">{f.label}</label>
                      {f.type === 'textarea' ? (
                        <textarea className="form-textarea" value={(newProject[f.key] as string) ?? ''} onChange={e => setNewProject(p => ({ ...p, [f.key]: e.target.value }))} rows={3} />
                      ) : (
                        <input type={f.type} className="form-input" value={(newProject[f.key] ? (f.type === 'date' ? new Date(newProject[f.key] as Date).toISOString().split('T')[0] : (newProject[f.key] as string)) : '')} onChange={e => setNewProject(p => ({ ...p, [f.key]: f.type === 'date' ? new Date(e.target.value) : e.target.value }))} />
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="form-field">
                    <label className="form-label">GitHub Repository URL</label>
                    <input type="url" className="form-input" value={(newProject.githubUrl as string) ?? ''} onChange={e => setNewProject(p => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/username/repo" />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>We'll fetch the project details from GitHub</p>
                </>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddProject}>Add Project</button>
                <button className="btn btn-outline" onClick={() => { setShowAddProject(false); setNewProject({}); setAddProjectMode('manual'); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Experience Modal */}
        {showEditExperience && editingExperience && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Edit Experience</h3>
              {([
                { key: 'title', label: 'Job Title', type: 'text' },
                { key: 'company', label: 'Company', type: 'text' },
                { key: 'location', label: 'Location', type: 'text' },
                { key: 'startDate', label: 'Start Date', type: 'date' },
                { key: 'endDate', label: 'End Date (leave blank if current)', type: 'date' },
                { key: 'description', label: 'Description', type: 'textarea' },
              ] as { key: keyof Experience; label: string; type: string }[]).map(f => (
                <div key={f.key} className="form-field">
                  <label className="form-label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea 
                      className="form-textarea" 
                      value={(editingExperience[f.key] as string) ?? ''} 
                      onChange={e => setEditingExperience(p => ({ ...p!, [f.key]: e.target.value }))} 
                      rows={3} 
                    />
                  ) : (
                    <input 
                      type={f.type} 
                      className="form-input" 
                      value={(editingExperience[f.key] ? (f.type === 'date' ? new Date(editingExperience[f.key] as Date).toISOString().split('T')[0] : (editingExperience[f.key] as string)) : '')} 
                      onChange={e => setEditingExperience(p => ({ ...p!, [f.key]: f.type === 'date' ? new Date(e.target.value) : e.target.value }))} 
                    />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSaveEditExperience}>Save Changes</button>
                <button className="btn btn-outline" onClick={() => { setShowEditExperience(false); setEditingExperience(null); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {showEditProject && editingProject && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Edit Project</h3>
              {([
                { key: 'title', label: 'Project Title', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'startDate', label: 'Start Date', type: 'date' },
                { key: 'endDate', label: 'End Date', type: 'date' },
                { key: 'githubUrl', label: 'GitHub URL', type: 'url' },
                { key: 'demoUrl', label: 'Demo URL', type: 'url' },
              ] as { key: keyof Project; label: string; type: string }[]).map(f => (
                <div key={f.key} className="form-field">
                  <label className="form-label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea 
                      className="form-textarea" 
                      value={(editingProject[f.key] as string) ?? ''} 
                      onChange={e => setEditingProject(p => ({ ...p!, [f.key]: e.target.value }))} 
                      rows={3} 
                    />
                  ) : (
                    <input 
                      type={f.type} 
                      className="form-input" 
                      value={(editingProject[f.key] ? (f.type === 'date' ? new Date(editingProject[f.key] as Date).toISOString().split('T')[0] : (editingProject[f.key] as string)) : '')} 
                      onChange={e => setEditingProject(p => ({ ...p!, [f.key]: f.type === 'date' ? new Date(e.target.value) : e.target.value }))} 
                    />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSaveEditProject}>Save Changes</button>
                <button className="btn btn-outline" onClick={() => { setShowEditProject(false); setEditingProject(null); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
