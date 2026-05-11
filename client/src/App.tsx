import { useEffect } from 'react';
import { RouterView } from './router';
import { useAuthStore } from './store/useAuthStore';
import './App.css';

const App = () => {
  const initAuth = useAuthStore(s => s.initAuth);

  // Validate stored token on app start
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <RouterView />;
};

export default App;
