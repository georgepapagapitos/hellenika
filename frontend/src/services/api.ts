import axios from "axios";
import { API_URL } from "../config";
import { Word, WordFormData } from "../types";

// Create a dedicated API client
const createApiClient = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const api = createApiClient();

// Word-related API calls
export const wordService = {
  // Get all words
  getAll: async (): Promise<Word[]> => {
    const response = await api.get(`${API_URL}/words`);
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
