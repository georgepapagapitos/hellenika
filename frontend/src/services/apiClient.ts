import axios, { AxiosInstance } from "axios";

export const createApiClient = (): AxiosInstance => {
  return axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
