import { useState } from "react";
import { useNavigate } from "react-router";
import "@/styles/Frame237.css";
import "@/styles/clickable.css";
import "@/styles/landing.css";

const LandingPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/jobs${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`);
    };

    return (
        <div className="scroll-container">
            <div id="2_37" className="Pixso-frame-2_37">

                {/* ── Navbar ─────────────────────────────────────── */}
                <div id="2_38" className="stroke-wrapper-2_38">
                    <div className="Pixso-frame-2_38">
                        <div className="frame-content-2_38">
                            {/* Logo */}
                            <div id="2_39" className="Pixso-frame-2_39" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                                <div id="2_40" className="Pixso-frame-2_40">
                                    <div className="frame-content-2_40">
                                        <div id="2_41" className="Pixso-frame-2_41">
                                            <div className="stroke-wrapper-2_42"><div className="Pixso-rectangle-2_42"></div><div className="stroke-2_42"></div></div>
                                            <div className="stroke-wrapper-2_43"><div className="Pixso-rectangle-2_43"></div><div className="stroke-2_43"></div></div>
                                            <div className="stroke-wrapper-2_44"><div className="Pixso-rectangle-2_44"></div><div className="stroke-2_44"></div></div>
                                            <div className="Pixso-vector-2_45"></div>
                                            <div className="Pixso-vector-2_46"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Single "RefNet" text — removed duplicate 2_139 */}
                                <p id="2_47" className="Pixso-paragraph-2_47">{"RefNet"}</p>
                            </div>

                            {/* Nav links */}
                            <div id="2_48" className="Pixso-frame-2_48">
                                <p id="2_49" className="Pixso-paragraph-2_49 clickable" onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>{"How It Works"}</p>
                                <p id="2_50" className="Pixso-paragraph-2_50 clickable" onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>{"For Employers"}</p>
                                <p id="2_51" className="Pixso-paragraph-2_51 clickable" onClick={() => navigate('/pricing')} style={{ cursor: 'pointer' }}>{"Pricing"}</p>
                                <p id="2_52" className="Pixso-paragraph-2_52 clickable" onClick={() => navigate('/resources')} style={{ cursor: 'pointer' }}>{"Resources"}</p>
                            </div>

                            {/* CTA buttons */}
                            <div id="2_53" className="Pixso-frame-2_53">
                                <div id="2_54" className="stroke-wrapper-2_54 clickable" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
                                    <div className="Pixso-frame-2_54">
                                        <div className="frame-content-2_54">
                                            <p id="2_135" className="Pixso-paragraph-2_135">{"Log In"}</p>
                                        </div>
                                    </div>
                                    <div className="stroke-2_54"></div>
                                </div>
                                <div id="2_55" className="Pixso-frame-2_55 clickable" onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>
                                    <div className="frame-content-2_55">
                                        <p id="2_56" className="Pixso-paragraph-2_56">{"Get Referred Free"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stroke-2_38"></div>
                </div>

                {/* ── Hero ───────────────────────────────────────── */}
                <div id="2_57" className="Pixso-frame-2_57">
                    <div className="frame-content-2_57">
                        {/* Left: headline + search */}
                        <div id="2_58" className="Pixso-frame-2_58">
                            <div className="frame-content-2_58">
                                <div id="2_59" className="Pixso-frame-2_59">
                                    <div id="2_60" className="Pixso-vector-2_60"></div>
                                    <p id="2_62" className="Pixso-paragraph-2_62">{"India's #1 Referral Network for Freshers"}</p>
                                </div>
                                <p id="2_63" className="Pixso-paragraph-2_63">{"Get Referred.\nGet Hired."}</p>
                                <p id="2_64" className="Pixso-paragraph-2_64">{"Connect with IT professionals at your dream companies. Request referrals, track your status, and land your first job faster."}</p>

                                {/* Search bar */}
                                <form id="2_65" className="stroke-wrapper-2_65" onSubmit={handleSearch} style={{ display: 'flex' }}>
                                    <div className="Pixso-frame-2_65">
                                        <div className="frame-content-2_65">
                                            <div id="2_66" className="Pixso-vector-2_66"></div>
                                            <input
                                                id="2_69"
                                                className="Pixso-paragraph-2_69"
                                                type="text"
                                                placeholder="Search jobs, companies, roles…"
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'inherit', cursor: 'text', width: '100%', flexGrow: 1, flexShrink: 1 }}
                                            />
                                            <div id="2_70" className="Pixso-frame-2_70 clickable" onClick={handleSearch} style={{ cursor: 'pointer' }}>
                                                <div className="frame-content-2_70">
                                                    <p id="2_71" className="Pixso-paragraph-2_71">{"Search Jobs"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stroke-2_65"></div>
                                </form>

                                {/* Popular tags */}
                                <div id="2_72" className="Pixso-frame-2_72">
                                    <p id="2_73" className="Pixso-paragraph-2_73">{"Popular:"}</p>
                                    {[
                                        { id: "2_74", text: "SDE @ Google", q: "SDE Google" },
                                        { id: "2_75", text: "Analyst @ Infosys", q: "Analyst Infosys" },
                                        { id: "2_76", text: "PM @ Flipkart", q: "PM Flipkart" },
                                    ].map(tag => (
                                        <div key={tag.id} className="stroke-wrapper-2_74 clickable" style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag.q)}`)}>
                                            <div className="Pixso-frame-2_74">
                                                <p className="Pixso-paragraph-2_136">{tag.text}</p>
                                            </div>
                                            <div className="stroke-2_74"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: referral preview card + stats */}
                        <div id="2_77" className="Pixso-frame-2_77">
                            <div className="frame-content-2_77">
                                <div id="2_78" className="stroke-wrapper-2_78">
                                    <div className="Pixso-frame-2_78">
                                        <div className="frame-content-2_78">
                                            <div id="2_79" className="Pixso-frame-2_79">
                                                <div className="frame-content-2_79">
                                                    <div id="2_80" className="Pixso-vector-2_80"></div>
                                                    <div id="2_81" className="Pixso-frame-2_81">
                                                        <div className="frame-content-2_81">
                                                            <p id="2_82" className="Pixso-paragraph-2_82">{"Rahul Sharma"}</p>
                                                            <p id="2_83" className="Pixso-paragraph-2_83">{"SDE-3 @ Google · 4 yrs exp"}</p>
                                                        </div>
                                                    </div>
                                                    <div id="2_84" className="Pixso-frame-2_84">
                                                        <p id="2_85" className="Pixso-paragraph-2_85">{"Can Refer"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="2_86" className="Pixso-frame-2_86"></div>
                                            <div id="2_87" className="Pixso-frame-2_87">
                                                <div className="frame-content-2_87">
                                                    <p id="2_88" className="Pixso-paragraph-2_88">{"Referral Request"}</p>
                                                    <div id="2_89" className="Pixso-frame-2_89">
                                                        <div id="2_90" className="Pixso-frame-2_90"></div>
                                                        <p id="2_91" className="Pixso-paragraph-2_91">{"Pending Review"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stroke-2_78"></div>
                                </div>

                                {/* Stats row */}
                                <div id="2_92" className="Pixso-frame-2_92">
                                    <div className="frame-content-2_92">
                                        <div id="2_93" className="Pixso-frame-2_93">
                                            <div className="frame-content-2_93">
                                                <p id="2_94" className="Pixso-paragraph-2_94">{"12,400+"}</p>
                                                <p id="2_95" className="Pixso-paragraph-2_95">{"Freshers Placed"}</p>
                                            </div>
                                        </div>
                                        <div id="2_96" className="stroke-wrapper-2_96">
                                            <div className="Pixso-frame-2_96">
                                                <div className="frame-content-2_96">
                                                    <p id="2_97" className="Pixso-paragraph-2_97">{"3,800+"}</p>
                                                    <p id="2_98" className="Pixso-paragraph-2_98">{"Professionals"}</p>
                                                </div>
                                            </div>
                                            <div className="stroke-2_96"></div>
                                        </div>
                                        <div id="2_99" className="stroke-wrapper-2_99">
                                            <div className="Pixso-frame-2_99">
                                                <div className="frame-content-2_99">
                                                    <p id="2_100" className="Pixso-paragraph-2_100">{"94%"}</p>
                                                    <p id="2_101" className="Pixso-paragraph-2_101">{"Response Rate"}</p>
                                                </div>
                                            </div>
                                            <div className="stroke-2_99"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── How RefNet Works ───────────────────────────── */}
                <div id="2_102" className="stroke-wrapper-2_102">
                    <div className="Pixso-frame-2_102">
                        <div className="frame-content-2_102">
                            <p id="2_103" className="Pixso-paragraph-2_103">{"How RefNet Works"}</p>
                            <div id="2_104" className="Pixso-frame-2_104">
                                <div className="frame-content-2_104">
                                    {[
                                        { id: "2_105", icon: "2_107", cls: "Pixso-vector-2_107", iconFrame: "Pixso-frame-2_106", iconBg: "brand-primary-light", step: "1. Find a Job", desc: "Browse thousands of openings at top IT companies", onClick: () => navigate('/jobs') },
                                        { id: "2_112", icon: "2_114", cls: "Pixso-vector-2_114", iconFrame: "Pixso-frame-2_113", iconBg: "brand-primary-light", step: "2. Match a Referrer", desc: "Get matched with professionals who work at that company", onClick: () => navigate('/jobs') },
                                        { id: "2_121", icon: "2_123", cls: "Pixso-vector-2_123", iconFrame: "Pixso-frame-2_122", iconBg: "brand-accent-light", step: "3. Request Referral", desc: "Send your profile and request a referral with one click", onClick: () => navigate('/signup') },
                                        { id: "2_128", icon: "2_130", cls: "Pixso-vector-2_130", iconFrame: "Pixso-frame-2_129", iconBg: "brand-warning-light", step: "4. Track & Get Hired", desc: "Monitor your referral status from pending to offer letter", onClick: () => navigate('/dashboard') },
                                    ].map((item, i) => (
                                        <div key={item.id} id={item.id} className={`Pixso-frame-2_${i === 0 ? '105' : i === 1 ? '112' : i === 2 ? '121' : '128'} clickable`} onClick={item.onClick} style={{ cursor: 'pointer' }}>
                                            <div className={`frame-content-2_${i === 0 ? '105' : i === 1 ? '112' : i === 2 ? '121' : '128'}`}>
                                                <div className={item.iconFrame} style={{ width: 44, height: 44, borderRadius: 22, background: `var(--${item.iconBg})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <div className={item.cls}></div>
                                                </div>
                                                <p className={`Pixso-paragraph-2_${i === 0 ? '110' : i === 1 ? '119' : i === 2 ? '126' : '133'}`}>{item.step}</p>
                                                <p className={`Pixso-paragraph-2_${i === 0 ? '111' : i === 1 ? '120' : i === 2 ? '127' : '134'}`}>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stroke-2_102"></div>
                </div>

                {/* ── Professionals from (company logos bar) ─────── */}
                <div id="2_140" className="Pixso-frame-2_140">
                    <div className="frame-content-2_140">
                        <p id="2_141" className="Pixso-paragraph-2_141">{"Professionals from:"}</p>
                        {[
                            { name: "Google", url: "https://www.google.com/about/careers/" },
                            { name: "Flipkart", url: "https://www.flipkartcareers.com/" },
                            { name: "Infosys", url: "https://www.infosys.com/careers/" },
                            { name: "Wipro", url: "https://careers.wipro.com/" },
                            { name: "TCS", url: "https://www.tcs.com/careers" },
                            { name: "Amazon", url: "https://www.amazon.jobs/" }
                        ].map((co, i) => (
                            <a 
                                key={co.name} 
                                id={`2_${142 + i}`} 
                                className={`Pixso-paragraph-2_${142 + i} clickable`}
                                href={co.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#4f6ef7'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                            >
                                {co.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── Footer ─────────────────────────────────────── */}
                <footer className="landing-footer">
                    <div className="landing-footer-inner">
                        <div className="landing-footer-brand">
                            <div className="landing-footer-logo">
                                <div className="auth-logo-icon">
                                    <div className="logo-bar"></div>
                                    <div className="logo-bar"></div>
                                    <div className="logo-bar"></div>
                                </div>
                                <span>RefNet</span>
                            </div>
                            <p>India's #1 referral network connecting freshers with IT professionals.</p>
                        </div>
                        <div className="landing-footer-links">
                            <div className="footer-col">
                                <p className="footer-col-title">Product</p>
                                <span onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>How It Works</span>
                                <span onClick={() => navigate('/jobs')} style={{ cursor: 'pointer' }}>Browse Jobs</span>
                                <span onClick={() => navigate('/pricing')} style={{ cursor: 'pointer' }}>Pricing</span>
                            </div>
                            <div className="footer-col">
                                <p className="footer-col-title">Company</p>
                                <span onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About Us</span>
                                <span onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>For Employers</span>
                                <span onClick={() => navigate('/resources')} style={{ cursor: 'pointer' }}>Resources</span>
                            </div>
                            <div className="footer-col">
                                <p className="footer-col-title">Top Companies</p>
                                <a href="https://www.google.com/about/careers/" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>Google Careers</a>
                                <a href="https://www.flipkartcareers.com/" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>Flipkart Careers</a>
                                <a href="https://www.infosys.com/careers/" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>Infosys Careers</a>
                                <a href="https://careers.wipro.com/" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>Wipro Careers</a>
                                <a href="https://www.tcs.com/careers" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>TCS Careers</a>
                                <a href="https://www.amazon.jobs/" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>Amazon Jobs</a>
                            </div>
                            <div className="footer-col">
                                <p className="footer-col-title">Account</p>
                                <span onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Log In</span>
                                <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>Sign Up</span>
                                <span onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</span>
                            </div>
                        </div>
                    </div>
                    <div className="landing-footer-bottom">
                        <p>© 2025 RefNet. All rights reserved.</p>
                    </div>
                </footer>

            </div>
        </div>
    );
};

export default LandingPage;
