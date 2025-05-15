import axios from "axios";
import { API_ENDPOINTS } from "../config";

// Function to translate text from English to Greek
export const translateToGreek = async (
  text: string
): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.translation}/to-greek`,
      { text },
      { withCredentials: true }
    );
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
    const response = await axios.post(
      `${API_ENDPOINTS.translation}/to-english`,
      { text },
      { withCredentials: true }
    );
    return response.data.translated_text;
  } catch (error) {
    console.error("Error translating to English:", error);
    return null;
  }
};
