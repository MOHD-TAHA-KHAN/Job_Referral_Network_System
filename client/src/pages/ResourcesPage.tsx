import { useNavigate } from "react-router";
import "@/styles/landing.css";

const ResourcesPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {/* Navbar */}
            <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 64px', height: 72, borderBottom: '1px solid #eee', background: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <div style={{ width: 14, height: 2, background: '#fff', borderRadius: 1 }}></div>
                            <div style={{ width: 10, height: 2, background: '#fff', borderRadius: 1 }}></div>
                            <div style={{ width: 7, height: 2, background: '#fff', borderRadius: 1 }}></div>
                        </div>
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>RefNet</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => navigate('/login')} style={{ padding: '8px 20px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Log In</button>
                    <button onClick={() => navigate('/signup')} style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: '#6c63ff', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Get Referred Free</button>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ textAlign: 'center', padding: '80px 64px 60px', background: 'linear-gradient(135deg, #eef1fe 0%, #fef3c7 60%, #f3f4f8 100%)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fef3c7', borderRadius: 20, padding: '6px 14px', marginBottom: 24 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#92400e' }}>📚 Resources & Guides</span>
                </div>
                <h1 style={{ fontSize: 48, fontWeight: 800, color: '#111', lineHeight: 1.15, marginBottom: 20 }}>Learn. Grow. Get Hired.</h1>
                <p style={{ fontSize: 17, color: '#666', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.6 }}>
                    Expert guides, interview tips, resume templates, and career advice to help you land your dream job.
                </p>
            </section>

            {/* Resource Categories */}
            <section style={{ padding: '64px 80px', background: '#fff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
                    {[
                        { icon: '📝', title: 'Resume Templates', desc: 'ATS-friendly resume templates for freshers. Download and customize for free.', color: '#ede9ff', link: '/signup' },
                        { icon: '💼', title: 'Interview Guides', desc: 'Common interview questions, coding challenges, and behavioral tips for top companies.', color: '#d1fae5', link: '/signup' },
                        { icon: '🎯', title: 'Career Roadmaps', desc: 'Step-by-step guides for SDE, Data Analyst, Product Manager, and more roles.', color: '#fef3c7', link: '/signup' },
                        { icon: '🚀', title: 'Referral Tips', desc: 'How to write the perfect referral request and follow up with professionals.', color: '#fecaca', link: '/signup' },
                        { icon: '📊', title: 'Salary Insights', desc: 'Average salaries for freshers at Google, Flipkart, TCS, and 500+ companies.', color: '#dbeafe', link: '/signup' },
                        { icon: '🎓', title: 'Skill Courses', desc: 'Free and paid courses to upskill in DSA, System Design, Web Dev, and more.', color: '#e9d5ff', link: '/signup' },
                    ].map(item => (
                        <div key={item.title} onClick={() => navigate(item.link)} style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                            <div style={{ width: 48, height: 48, borderRadius: 24, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{item.icon}</div>
                            <p style={{ fontWeight: 700, fontSize: 16, color: '#111', margin: 0 }}>{item.title}</p>
                            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                            <span style={{ fontSize: 13, color: '#6c63ff', fontWeight: 600 }}>Explore →</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Latest Blog Posts */}
            <section style={{ padding: '64px 80px', background: '#fafafa' }}>
                <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 48, color: '#111' }}>Latest from the Blog</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
                    {[
                        { title: 'How to Get a Referral at Google in 2025', date: 'May 10, 2026', category: 'Referrals', img: '#ede9ff' },
                        { title: '10 Common Mistakes in Fresher Resumes', date: 'May 8, 2026', category: 'Resume Tips', img: '#d1fae5' },
                        { title: 'SDE Interview Prep: Complete Roadmap', date: 'May 5, 2026', category: 'Interview Prep', img: '#fef3c7' },
                    ].map(post => (
                        <div key={post.title} onClick={() => navigate('/signup')} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                            <div style={{ height: 160, background: post.img }}></div>
                            <div style={{ padding: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#6c63ff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{post.category}</span>
                                    <span style={{ fontSize: 11, color: '#aaa' }}>•</span>
                                    <span style={{ fontSize: 11, color: '#aaa' }}>{post.date}</span>
                                </div>
                                <p style={{ fontSize: 15, fontWeight: 600, color: '#111', lineHeight: 1.4, margin: 0 }}>{post.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button onClick={() => navigate('/signup')} style={{ padding: '12px 28px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                        View All Posts →
                    </button>
                </div>
            </section>

            {/* Stats */}
            <section style={{ padding: '48px 80px', background: '#6c63ff' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 64, maxWidth: 800, margin: '0 auto' }}>
                    {[
                        { value: '150+', label: 'Guides & Articles' },
                        { value: '50+', label: 'Resume Templates' },
                        { value: '1,000+', label: 'Interview Questions' },
                        { value: '500+', label: 'Company Insights' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: 0 }}>{s.value}</p>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '4px 0 0' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '64px 80px', textAlign: 'center', background: '#fff' }}>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: '#111', marginBottom: 16 }}>Ready to start your journey?</h2>
                <p style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>Sign up for free and get access to all resources, guides, and templates.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button onClick={() => navigate('/signup')} style={{ padding: '13px 28px', borderRadius: 10, border: 'none', background: '#6c63ff', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Sign Up Free</button>
                    <button onClick={() => navigate('/about')} style={{ padding: '13px 28px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Learn More</button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#1a1a2e', padding: '24px 64px', textAlign: 'center', borderTop: '1px solid #2a2a3e' }}>
                <p style={{ fontSize: 12, color: '#444', margin: 0 }}>© 2025 RefNet. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ResourcesPage;
