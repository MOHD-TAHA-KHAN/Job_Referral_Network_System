import { Route, Routes, useLocation } from "react-router";
import { routes } from "../routes";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";


const RouterView = () => {
  const location = useLocation();
  
  return (
    <Routes location={location} key={location.pathname}>
      {routes.map((route) => {
        const Component = route.component;
        const element = (
          <Layout showNavigation={route.showNavigation !== false}>
            {route.protected ? (
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            ) : (
              <Component />
            )}
          </Layout>
        );
        
        return (
          <Route
            key={route.path}
            path={route.path}
            element={element}
          />
        );
      })}
    </Routes>
  );
};

export default RouterView;
