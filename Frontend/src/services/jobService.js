import api from "./api";
import { formatJobData } from "../utils/formatters";

const jobService = {
  /**
   * Fetch public jobs with optional filters
   * @param {Object} params - Query parameters (limit, page, search, etc.)
   * @returns {Promise<Array>} Formatted jobs list
   */
  getPublicJobs: async (params = {}) => {
    try {
      // Convert params simple object to query string if needed,
      // but axios handles params object automatically
      const response = await api.get("/jobs/public", { params });

      if (!response.data) return [];

      return response.data.map(formatJobData);
    } catch (error) {
      console.error("Error fetching public jobs:", error);
      throw error;
    }
  },

  /**
   * Get a single public job details
   * @param {string} id - Job ID
   * @returns {Promise<Object>} Formatted job details
   */
  getJobDetails: async (id) => {
    try {
      // Assuming backend route will be created for single public job
      // For now, using public list logic or dedicated route if exists
      // Current backend route: router.route('/jobs/:id').get(getJobById); (Auth required usually?)
      // We need a public route. For now reusing public jobs list if specific ID fetch isn't public.
      // Wait, standard getJobById might be public or protected.
      // Let's assume we maintain /jobs/public/:id or similar in future.
      // For this implementation, we might need to filter from list if no direct route.
      // But better: use the existing /jobs/public endpoint and filter if needed,
      // OR update backend to allow public access to single job.

      // Temporary strategy: Fetch all public and find.
      // Ideally: Update backend.

      const response = await api.get(`/jobs/public/${id}`); // We will need to implement this backend route
      return formatJobData(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
      throw error;
    }
  },
};

export default jobService;
