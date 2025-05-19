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
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data.translated_text;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error translating to Greek:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
    } else {
      console.error("Error translating to Greek:", error);
    }
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
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data.translated_text;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error translating to English:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
    } else {
      console.error("Error translating to English:", error);
    }
    return null;
  }
};
