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
      const response = await api.get(`/jobs/public/${id}`);
      return formatJobData(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
      throw error;
    }
  },
};

export default jobService;
