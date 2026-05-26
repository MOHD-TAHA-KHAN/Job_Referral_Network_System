import { useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { RouterView } from './router';
import { useAuthStore } from './store/useAuthStore';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

const App = () => {
  const initAuth = useAuthStore(s => s.initAuth);

  // Validate stored token on app start
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <RouterView />
      <Analytics />
    </>
  );
};

export default App;
