const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/v1";

export { API_URL };

export const API_ENDPOINTS = {
  words: `${API_URL}/words`,
  translation: `${API_URL}/translation`,
  auth: {
    token: `${API_URL}/auth/token`,
    register: `${API_URL}/auth/register`,
    me: `${API_URL}/auth/users/me`,
  },
  admin: `${API_URL}/admin`,
} as const;
