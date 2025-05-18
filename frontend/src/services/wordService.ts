import axios from "axios";
import { API_ENDPOINTS } from "../config";
import { Word, WordFormData, WordType, Gender } from "../types";


// Create a dedicated API client
const createApiClient = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });
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

class WordService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  async getAll(filters?: WordFilters): Promise<PaginatedResponse> {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.wordType) params.append("word_type", filters.wordType);
    if (filters?.gender) params.append("gender", filters.gender);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.size) params.append("size", filters.size.toString());

    const response = await api.get<PaginatedResponse>(`${API_ENDPOINTS.words}?${params.toString()}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async createWord(word: WordFormData): Promise<Word> {
    const response = await api.post<Word>(API_ENDPOINTS.words, word, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async updateWord(id: number, word: WordFormData): Promise<Word> {
    const response = await api.put<Word>(`${API_ENDPOINTS.words}/${id}`, word, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async deleteWord(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.words}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}

export const wordService = new WordService();
