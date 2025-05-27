import { API_ENDPOINTS } from "../config";
import { Gender, Word, WordFormData, WordType } from "../types";
import { api } from "./apiClient";

interface WordFilters {
  page?: number;
  size?: number;
  search?: string;
  wordType?: WordType;
  gender?: Gender;
  includePending?: boolean;
}

interface PaginatedResponse {
  items: Word[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export const wordService = {
  async getWords(filters?: WordFilters): Promise<PaginatedResponse> {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.size) params.append("size", filters.size.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.wordType) params.append("word_type", filters.wordType);
    if (filters?.gender) params.append("gender", filters.gender);
    if (filters?.includePending) params.append("include_pending", "true");

    const response = await api.get<PaginatedResponse>(
      `${API_ENDPOINTS.words}?${params.toString()}`,
    );
    return response.data;
  },

  async createWord(word: WordFormData): Promise<Word> {
    const response = await api.post<Word>(API_ENDPOINTS.words, word);
    return response.data;
  },

  async updateWord(id: number, word: WordFormData): Promise<Word> {
    const response = await api.put<Word>(`${API_ENDPOINTS.words}/${id}`, word);
    return response.data;
  },

  async deleteWord(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.words}/${id}`);
  },

  async getWordById(id: number): Promise<Word> {
    const response = await api.get<Word>(`${API_ENDPOINTS.words}/${id}`);
    return response.data;
  },

  // Admin only methods
  async getPendingWords(): Promise<Word[]> {
    const response = await api.get<Word[]>(`${API_ENDPOINTS.words}/pending`);
    return response.data;
  },

  async approveWord(id: number): Promise<Word> {
    const response = await api.post<Word>(
      `${API_ENDPOINTS.words}/${id}/approve`,
      null,
    );
    return response.data;
  },

  async rejectWord(id: number): Promise<Word> {
    const response = await api.post<Word>(
      `${API_ENDPOINTS.words}/${id}/reject`,
      null,
    );
    return response.data;
  },
};
