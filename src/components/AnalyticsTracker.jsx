import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const logPageView = async () => {
      try {
        const { error } = await supabase.rpc('increment_page_view', { page_path: location.pathname });
        if (error) console.error('Error logging page view:', error);
      } catch (err) {
        console.error('Exception logging page view:', err);
      }
    };

    if (!location.pathname.startsWith('/admin')) {
      logPageView();
    }
  }, [location.pathname]);

  return null;
}
