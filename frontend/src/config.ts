const API_URL = process.env.REACT_APP_API_URL || "http://192.168.0.20:8000/api";

export { API_URL };

export const API_ENDPOINTS = {
  words: `${API_URL}/words`,
  translation: `${API_URL}/translation`,
} as const;
