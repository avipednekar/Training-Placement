import { useEffect, useState } from 'react';
import jobService from '../services/jobService';

const usePublicJobs = (params = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        const result = await jobService.getPublicJobs(params);
        if (isMounted) {
          setJobs(result);
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

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(params)]);

  return { jobs, loading, error };
};

export default usePublicJobs;

