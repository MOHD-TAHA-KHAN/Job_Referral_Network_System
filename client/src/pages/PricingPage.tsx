import { useNavigate } from "react-router";
import "@/styles/landing.css";

const PricingPage = () => {
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
            <section style={{ textAlign: 'center', padding: '80px 64px 60px', background: 'linear-gradient(135deg, #eef1fe 0%, #f0fdf9 60%, #f3f4f8 100%)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#d1fae5', borderRadius: 20, padding: '6px 14px', marginBottom: 24 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>💰 Simple, Transparent Pricing</span>
                </div>
                <h1 style={{ fontSize: 48, fontWeight: 800, color: '#111', lineHeight: 1.15, marginBottom: 20 }}>Get Referred. Get Hired.</h1>
                <p style={{ fontSize: 17, color: '#666', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.6 }}>
                    RefNet is 100% free for freshers. Companies pay only when they hire through our platform.
                </p>
            </section>

            {/* Pricing Cards */}
            <section style={{ padding: '64px 80px', background: '#fff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, maxWidth: 1100, margin: '0 auto' }}>
                    {/* Fresher Plan */}
                    <div style={{ background: '#fafafa', border: '2px solid #eee', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#6c63ff', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>For Freshers</p>
                            <h3 style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 8px' }}>₹0<span style={{ fontSize: 16, fontWeight: 500, color: '#888' }}>/forever</span></h3>
                            <p style={{ fontSize: 13, color: '#666', margin: 0 }}>100% free. No hidden charges.</p>
                        </div>
                        <button onClick={() => navigate('/signup')} style={{ padding: '12px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Sign Up Free
                        </button>
                        <div style={{ borderTop: '1px solid #ddd', paddingTop: 20 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>What's Included</p>
                            {[
                                'Browse unlimited jobs',
                                'Request unlimited referrals',
                                'AI-powered referrer matching',
                                'Real-time status tracking',
                                'In-app messaging with referrers',
                                'Profile & resume builder',
                                'Email & push notifications',
                            ].map(f => (
                                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                                    <span style={{ color: '#22c55e', fontSize: 16, flexShrink: 0 }}>✓</span>
                                    <span style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Professional Plan */}
                    <div style={{ background: '#fafafa', border: '2px solid #eee', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#6c63ff', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>For Professionals</p>
                            <h3 style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 8px' }}>₹0<span style={{ fontSize: 16, fontWeight: 500, color: '#888' }}>/forever</span></h3>
                            <p style={{ fontSize: 13, color: '#666', margin: 0 }}>Give back to the community.</p>
                        </div>
                        <button onClick={() => navigate('/signup')} style={{ padding: '12px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Join as Professional
                        </button>
                        <div style={{ borderTop: '1px solid #ddd', paddingTop: 20 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>What's Included</p>
                            {[
                                'Receive referral requests',
                                'Smart filtering by skills & domain',
                                'One-click accept/decline',
                                'Track referrals you have given',
                                'Build your professional brand',
                                'Karma points & leaderboard',
                                'Priority support',
                            ].map(f => (
                                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                                    <span style={{ color: '#22c55e', fontSize: 16, flexShrink: 0 }}>✓</span>
                                    <span style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enterprise Plan */}
                    <div style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #4f46e5 100%)', border: '2px solid #6c63ff', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -12, right: 24, background: '#fbbf24', color: '#78350f', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Popular</div>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>For Companies</p>
                            <h3 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Custom<span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}></span></h3>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Pay only for successful hires.</p>
                        </div>
                        <button onClick={() => navigate('/contact')} style={{ padding: '12px', borderRadius: 10, border: 'none', background: '#fff', color: '#6c63ff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Contact Sales
                        </button>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 20 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>What's Included</p>
                            {[
                                'Post unlimited jobs',
                                'Access to 12,000+ freshers',
                                'Verified employee referrals',
                                'Dedicated account manager',
                                'Custom branding & career page',
                                'Analytics & hiring insights',
                                'API integration',
                                'Priority listing in search',
                            ].map(f => (
                                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                                    <span style={{ color: '#d1fae5', fontSize: 16, flexShrink: 0 }}>✓</span>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ padding: '64px 80px', background: '#fafafa' }}>
                <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 48, color: '#111' }}>Frequently Asked Questions</h2>
                <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {[
                        { q: 'Is RefNet really free for freshers?', a: 'Yes! RefNet is 100% free for freshers and job seekers. You can browse jobs, request referrals, and track your applications without any charges.' },
                        { q: 'How do companies pay?', a: 'Companies pay a success fee only when they hire a candidate through RefNet. No upfront costs, no subscription fees.' },
                        { q: 'Do professionals get paid for giving referrals?', a: 'Professionals use RefNet to give back to the community and build their brand. Many companies have internal referral bonus programs that reward employees separately.' },
                        { q: 'Can I cancel anytime?', a: 'Since RefNet is free for individuals, there is nothing to cancel. Companies can pause or cancel their enterprise plan anytime with 30 days notice.' },
                    ].map(faq => (
                        <div key={faq.q} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 24 }}>
                            <p style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 8px' }}>{faq.q}</p>
                            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '64px 80px', textAlign: 'center', background: '#fff' }}>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: '#111', marginBottom: 16 }}>Ready to get started?</h2>
                <p style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>Join thousands of freshers landing their dream jobs through RefNet.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button onClick={() => navigate('/signup')} style={{ padding: '13px 28px', borderRadius: 10, border: 'none', background: '#6c63ff', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Sign Up Free</button>
                    <button onClick={() => navigate('/contact')} style={{ padding: '13px 28px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Contact Sales</button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#1a1a2e', padding: '24px 64px', textAlign: 'center', borderTop: '1px solid #2a2a3e' }}>
                <p style={{ fontSize: 12, color: '#444', margin: 0 }}>© 2025 RefNet. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PricingPage;
