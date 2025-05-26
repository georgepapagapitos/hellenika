import { API_ENDPOINTS } from "../config";
import { api } from "./apiClient";

// Function to translate text from English to Greek
export const translateToGreek = async (
  text: string
): Promise<string | null> => {
  try {
    const response = await api.post(`${API_ENDPOINTS.translation}/to-greek`, {
      text,
    });
    return response.data.translated_text;
  } catch (error) {
    console.error("Error translating to Greek:", error);
    return null;
  }
};

// Function to translate text from Greek to English
export const translateToEnglish = async (
  text: string
): Promise<string | null> => {
  try {
    const response = await api.post(`${API_ENDPOINTS.translation}/to-english`, {
      text,
    });
    return response.data.translated_text;
  } catch (error) {
    console.error("Error translating to English:", error);
    return null;
  }
};
