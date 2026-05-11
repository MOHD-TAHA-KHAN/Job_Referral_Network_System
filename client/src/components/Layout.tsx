import { ReactNode } from 'react';
import Navigation from './Navigation';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const Layout = ({ children, showNavigation = true }: LayoutProps) => {
  return (
    <div className={`layout ${showNavigation ? 'layout-with-nav' : 'layout-full'}`}>
      {showNavigation && <Navigation />}
      <main className={`layout-main ${showNavigation ? 'with-nav' : 'full-width'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
