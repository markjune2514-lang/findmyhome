import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PropertyDetail from './pages/PropertyDetail';
import ComparePage from './pages/ComparePage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import AddPropertyPage from './pages/AddPropertyPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import { CompareProvider } from './CompareContext';
import { PropertiesProvider } from './PropertiesContext';
import { AuthProvider } from './AuthContext';
import { FavoritesProvider } from './FavoritesContext';
import ProtectedRoute from './ProtectedRoute';
import AnalyticsTracker from './components/AnalyticsTracker';
import ScrollToTop from './components/ScrollToTop';

import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
      <PropertiesProvider>
        <CompareProvider>
          <FavoritesProvider>
          <Router>
            <ScrollToTop />
            <AnalyticsTracker />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="property/:id" element={<PropertyDetail />} />
                <Route path="compare" element={<ComparePage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="about" element={<AboutPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="add" element={<AddPropertyPage />} />
                <Route path="edit/:id" element={<AddPropertyPage />} />
              </Route>
            </Routes>
          </Router>
          </FavoritesProvider>
        </CompareProvider>
      </PropertiesProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
