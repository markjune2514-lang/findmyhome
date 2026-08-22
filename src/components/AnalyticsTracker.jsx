import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const logPageView = async () => {
      try {
        // Check if Admin is logged in, if so, do not track!
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          return;
        }

        const { error } = await supabase.rpc('increment_page_view', { page_path: location.pathname });
        if (error) console.error('Error logging page view:', error);
        
        // Call daily view increment (it will fail silently if table/RPC is not yet created in Supabase)
        await supabase.rpc('increment_daily_view').catch(() => {});
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
