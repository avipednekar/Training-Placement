import { useEffect, useState } from 'react';
import api from '../services/api';

const useTopCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCompanies = async () => {
      try {
        const res = await api.get('/company/all');
        if (isMounted) {
          setCompanies(res.data || []);
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

    fetchCompanies();

    return () => {
      isMounted = false;
    };
  }, []);

  return { companies, loading, error };
};

export default useTopCompanies;

