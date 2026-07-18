import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SearchPage from './pages/SearchPage';
import PropertyDetail from './pages/PropertyDetail';
import ComparePage from './pages/ComparePage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import AddPropertyPage from './pages/AddPropertyPage';
import { CompareProvider } from './CompareContext';
import { PropertiesProvider } from './PropertiesContext';

function App() {
  return (
    <PropertiesProvider>
      <CompareProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/search" replace />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="property/:id" element={<PropertyDetail />} />
              <Route path="compare" element={<ComparePage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="admin/add" element={<AddPropertyPage />} />
            </Route>
          </Routes>
        </Router>
      </CompareProvider>
    </PropertiesProvider>
  );
}

export default App;
