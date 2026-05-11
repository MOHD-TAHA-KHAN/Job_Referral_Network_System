import LandingPage       from '@/pages/LandingPage';
import LoginPage         from '@/pages/LoginPage';
import SignUpPage        from '@/pages/SignUpPage';
import OAuthCallback     from '@/pages/OAuthCallback';
import Dashboard         from '@/pages/Dashboard';
import Profile           from '@/pages/Profile';
import JobListings       from '@/pages/JobListings';
import JobDetails        from '@/pages/JobDetails';
import ReferralsPage     from '@/pages/ReferralsPage';
import Chat              from '@/pages/Chat';
import SettingsPage      from '@/pages/SettingsPage';
import AboutPage         from '@/pages/AboutPage';
import ContactPage       from '@/pages/ContactPage';
import OnboardingPage    from '@/pages/OnboardingPage';
import NotificationsPage from '@/pages/NotificationsPage';
import PricingPage       from '@/pages/PricingPage';
import ResourcesPage     from '@/pages/ResourcesPage';

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  name: string;
  protected?: boolean;
  showNavigation?: boolean;
}

export const routes: RouteConfig[] = [
  { path: '/',               component: LandingPage,       name: 'LandingPage',       showNavigation: false },
  { path: '/login',          component: LoginPage,         name: 'LoginPage',         showNavigation: false },
  { path: '/signup',         component: SignUpPage,        name: 'SignUpPage',        showNavigation: false },
  { path: '/auth/callback',  component: OAuthCallback,     name: 'OAuthCallback',     showNavigation: false },
  { path: '/dashboard',      component: Dashboard,         name: 'Dashboard',         protected: true,  showNavigation: false },
  { path: '/profile',        component: Profile,           name: 'Profile',           protected: true,  showNavigation: false },
  { path: '/jobs',           component: JobListings,       name: 'JobListings',       protected: true,  showNavigation: false },
  { path: '/jobs/:id',       component: JobDetails,        name: 'JobDetails',        protected: true,  showNavigation: false },
  { path: '/referrals',      component: ReferralsPage,     name: 'ReferralsPage',     protected: true,  showNavigation: false },
  { path: '/referrals/given',component: ReferralsPage,     name: 'ReferralsGiven',    protected: true,  showNavigation: false },
  { path: '/chat',           component: Chat,              name: 'Chat',              protected: true,  showNavigation: false },
  { path: '/notifications',  component: NotificationsPage, name: 'Notifications',     protected: true,  showNavigation: false },
  { path: '/settings',       component: SettingsPage,      name: 'SettingsPage',      protected: true,  showNavigation: false },
  { path: '/about',          component: AboutPage,         name: 'AboutPage',         showNavigation: false },
  { path: '/contact',        component: ContactPage,       name: 'ContactPage',       showNavigation: false },
  { path: '/pricing',        component: PricingPage,       name: 'PricingPage',       showNavigation: false },
  { path: '/resources',      component: ResourcesPage,     name: 'ResourcesPage',     showNavigation: false },
  { path: '/onboarding',     component: OnboardingPage,    name: 'OnboardingPage',    protected: true,  showNavigation: false },
];
