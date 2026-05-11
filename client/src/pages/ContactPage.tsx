import { useNavigate } from "react-router";

const ContactPage = () => {
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

            {/* Two-column layout */}
            <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
                {/* Left: brand pitch */}
                <div style={{ flex: 1.2, background: 'linear-gradient(135deg, #6c63ff 0%, #4f46e5 100%)', padding: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
                    <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: 0 }}>
                        India's #1 platform<br />for referral-powered hiring.
                    </h1>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0, maxWidth: 400 }}>
                        Join 12,000+ freshers who landed jobs at Google, Flipkart, TCS and 500+ top companies through genuine referrals.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            'Direct referrals from verified employees',
                            'Real-time status tracking (Pending → Referred)',
                            'In-app chat with referrers',
                        ].map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 20, height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', flexShrink: 0 }}>✓</div>
                                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                        {[{ v: '12,400+', l: 'Freshers Placed' }, { v: '3,800+', l: 'Professionals' }, { v: '94%', l: 'Response Rate' }].map(s => (
                            <div key={s.l}>
                                <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>{s.v}</p>
                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: contact / get started form */}
                <div style={{ flex: 1, padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
                    <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0 }}>Get in touch</h2>
                    <p style={{ fontSize: 14, color: '#888', margin: 0 }}>Interested in RefNet for your company? We'd love to hear from you.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { label: 'Full Name', placeholder: 'Priya Mehta', type: 'text' },
                            { label: 'Work Email', placeholder: 'hr@company.com', type: 'email' },
                            { label: 'Company', placeholder: 'Google India', type: 'text' },
                        ].map(f => (
                            <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 13, fontWeight: 500, color: '#555' }}>{f.label}</label>
                                <input
                                    type={f.type}
                                    placeholder={f.placeholder}
                                    style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                                />
                            </div>
                        ))}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 500, color: '#555' }}>Message</label>
                            <textarea
                                placeholder="Tell us how you'd like to use RefNet…"
                                rows={4}
                                style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                            />
                        </div>
                        <button style={{ padding: '12px', borderRadius: 10, border: 'none', background: '#6c63ff', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Send Message
                        </button>
                    </div>

                    <p style={{ fontSize: 13, color: '#888', textAlign: 'center', margin: 0 }}>
                        Looking to sign up as a fresher?{' '}
                        <span onClick={() => navigate('/signup')} style={{ color: '#6c63ff', cursor: 'pointer', fontWeight: 500 }}>Get Referred Free →</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
