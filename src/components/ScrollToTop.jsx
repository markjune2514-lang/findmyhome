import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // If returning to admin dashboard with a saved scroll target, let AdminDashboard handle smooth scroll
    const hasAdminReturnTarget = 
      sessionStorage.getItem('fmh_admin_last_prop_id') || 
      sessionStorage.getItem('fmh_admin_last_scroll_y') ||
      location.state?.returnToPropId;

    if (location.pathname === '/admin' && hasAdminReturnTarget) {
      return;
    }

    window.scrollTo(0, 0);
    const main = document.querySelector('.main-content') || document.querySelector('main');
    if (main) main.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}
