import axios from "axios";
import { API_URL } from "../config";
import { Word, WordFormData, WordType, Gender } from "../types";
import { authService } from "./auth";

// Create a dedicated API client
const createApiClient = () => {
  const client = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor to include auth token
  client.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

const api = createApiClient();

interface WordFilters {
  search?: string;
  wordType?: WordType | "";
  gender?: Gender | "";
  page?: number;
  size?: number;
}

interface PaginatedResponse {
  items: Word[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Word-related API calls
export const wordService = {
  // Get all words
  getAll: async (filters?: WordFilters): Promise<PaginatedResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.wordType) params.append("word_type", filters.wordType);
    if (filters?.gender) params.append("gender", filters.gender);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.size) params.append("size", filters.size.toString());

    const response = await api.get(`${API_URL}/words?${params.toString()}`);
    return response.data;
  },

  // Get a single word
  getById: async (id: number): Promise<Word> => {
    const response = await api.get(`${API_URL}/words/${id}`);
    return response.data;
  },

  // Create a new word
  create: async (wordData: WordFormData): Promise<Word> => {
    const response = await api.post(`${API_URL}/words`, wordData);
    return response.data;
  },

  // Update a word
  update: async (id: number, wordData: WordFormData): Promise<Word> => {
    const response = await api.put(`${API_URL}/words/${id}`, wordData);
    return response.data;
  },

  // Add a meaning to a word
  addMeaning: async (
    wordId: number,
    meaning: { english_meaning: string; is_primary: boolean }
  ): Promise<Word> => {
    const response = await api.post(
      `${API_URL}/words/${wordId}/meanings`,
      meaning
    );
    return response.data;
  },

  // Delete a word
  delete: async (id: number): Promise<{ success: boolean }> => {
    const response = await api.delete(`${API_URL}/words/${id}`);
    return response.data;
  },
};
