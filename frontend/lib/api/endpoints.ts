export const endpoints = {
  // Example endpoints - customize based on your backend API
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
  },
  users: {
    getProfile: '/users/profile',
    updateProfile: '/users/profile',
  },
  // Add more endpoints as needed
} as const;
