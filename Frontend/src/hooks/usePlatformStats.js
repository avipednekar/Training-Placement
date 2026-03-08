import { useEffect, useState } from 'react';
import api from '../services/api';

const usePlatformStats = () => {
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const [jobCountRes, companiesRes] = await Promise.all([
          api.get('/stats/company-count').catch(() => ({ data: { count: 0 } })),
          api.get('/company/all').catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          setStats({
            jobs: jobCountRes.data.count || 0,
            companies: companiesRes.data.length,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, loading, error };
};

export default usePlatformStats;

