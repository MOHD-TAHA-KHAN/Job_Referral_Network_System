import { useNavigate } from "react-router";
import "@/styles/landing.css";
import "@/styles/auth.css";

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {/* Navbar — same as landing */}
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
            <section style={{ textAlign: 'center', padding: '80px 64px 60px', background: 'linear-gradient(135deg, #eef1fe 0%, #f0fdf9 60%, #f3f4f8 100%)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ede9ff', borderRadius: 20, padding: '6px 14px', marginBottom: 24 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#6c63ff' }}>⚡ India's #1 Referral Network</span>
                </div>
                <h1 style={{ fontSize: 48, fontWeight: 800, color: '#111', lineHeight: 1.15, marginBottom: 20 }}>How RefNet Works</h1>
                <p style={{ fontSize: 17, color: '#666', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.6 }}>
                    We connect freshers with IT professionals at top companies for genuine, direct referrals — no middlemen, no spam.
                </p>
                <button onClick={() => navigate('/signup')} style={{ padding: '14px 32px', borderRadius: 12, border: 'none', background: '#6c63ff', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                    Get Started Free →
                </button>
            </section>

            {/* Steps */}
            <section style={{ padding: '64px 80px', background: '#fff' }}>
                <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 48, color: '#111' }}>4 Simple Steps</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
                    {[
                        { icon: '🔍', step: '1. Find a Job', desc: 'Browse thousands of openings at top IT companies like Google, Flipkart, TCS and more.', color: '#ede9ff' },
                        { icon: '🤝', step: '2. Match a Referrer', desc: 'Get matched with verified professionals who currently work at your target company.', color: '#ede9ff' },
                        { icon: '📤', step: '3. Request Referral', desc: 'Send your profile and a personalised message to request a referral with one click.', color: '#d1fae5' },
                        { icon: '📈', step: '4. Track & Get Hired', desc: 'Monitor your referral status in real-time — from Pending all the way to Offer Letter.', color: '#fef3c7' },
                    ].map(item => (
                        <div key={item.step} style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 24, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{item.icon}</div>
                            <p style={{ fontWeight: 700, fontSize: 15, color: '#111', margin: 0 }}>{item.step}</p>
                            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section style={{ padding: '48px 80px', background: '#6c63ff' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 64, maxWidth: 800, margin: '0 auto' }}>
                    {[
                        { value: '12,400+', label: 'Freshers Placed' },
                        { value: '3,800+', label: 'Verified Professionals' },
                        { value: '94%', label: 'Response Rate' },
                        { value: '500+', label: 'Companies' },
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
                <h2 style={{ fontSize: 32, fontWeight: 700, color: '#111', marginBottom: 16 }}>Ready to get referred?</h2>
                <p style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>Join thousands of freshers who landed their dream jobs through RefNet.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button onClick={() => navigate('/signup')} style={{ padding: '13px 28px', borderRadius: 10, border: 'none', background: '#6c63ff', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Sign Up Free</button>
                    <button onClick={() => navigate('/login')} style={{ padding: '13px 28px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Log In</button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#1a1a2e', padding: '24px 64px', textAlign: 'center', borderTop: '1px solid #2a2a3e' }}>
                <p style={{ fontSize: 12, color: '#444', margin: 0 }}>© 2025 RefNet. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AboutPage;
