import api from './api';

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getVisitorData: async () => {
    try {
      const response = await api.get('/dashboard/visitors');
      return response.data;
    } catch (error) {
      console.error('Error fetching visitor data:', error);
      throw error;
    }
  },

  getRegistrationData: async () => {
    try {
      const response = await api.get('/dashboard/registrations');
      return response.data;
    } catch (error) {
      console.error('Error fetching registration data:', error);
      throw error;
    }
  },

  getRecentActivities: async () => {
    try {
      const response = await api.get('/dashboard/activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  getRegistrationTypes: async () => {
    try {
      const response = await api.get('/dashboard/registration-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching registration types:', error);
      throw error;
    }
  }
}; 