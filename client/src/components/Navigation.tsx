import { useNavigate, useLocation } from "react-router";
import "./Navigation.css";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", name: "LandingPage" },
    { path: "/login", label: "Login", name: "LoginPage" },
    { path: "/signup", label: "Sign Up", name: "SignUpPage" },
    { path: "/dashboard", label: "Dashboard", name: "Dashboard" },
    { path: "/profile", label: "Profile", name: "Profile" },
    { path: "/jobs", label: "Browse Jobs", name: "JobListings" },
    { path: "/chat", label: "Chat", name: "Chat" },
    { path: "/settings", label: "Settings", name: "SettingsPage" },
    { path: "/about", label: "About", name: "AboutPage" },
    { path: "/contact", label: "Contact", name: "ContactPage" },
    { path: "/onboarding", label: "Onboarding", name: "OnboardingPage" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>RefNet</h2>
        </div>
        <div className="nav-menu">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-button ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
