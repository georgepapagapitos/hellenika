import { alpha } from "@mui/material/styles";
import { Gender, WordType } from "../types";

export const getWordTypeColor = (type: WordType) => {
  const colors: Record<WordType, { bg: string; text: string }> = {
    [WordType.NOUN]: { bg: "#EFF6FF", text: "#3B82F6" }, // Light Blue
    [WordType.VERB]: { bg: "#F5F3FF", text: "#8B5CF6" }, // Light Purple
    [WordType.ADJECTIVE]: { bg: "#ECFDF5", text: "#10B981" }, // Light Green
    [WordType.ADVERB]: { bg: "#ECFEFF", text: "#06B6D4" }, // Light Cyan
    [WordType.PRONOUN]: { bg: "#FFFBEB", text: "#F59E0B" }, // Light Amber
    [WordType.PREPOSITION]: { bg: "#FEF2F2", text: "#EF4444" }, // Light Red
    [WordType.CONJUNCTION]: { bg: "#F3F4F6", text: "#6B7280" }, // Light Gray
    [WordType.ARTICLE]: { bg: "#F9FAFB", text: "#9CA3AF" }, // Lighter Gray
  };
  return colors[type];
};

export const getGenderColor = (gender: Gender) => {
  const colors: Record<Gender, { bg: string; text: string }> = {
    [Gender.MASCULINE]: { bg: "#EFF6FF", text: "#2563EB" }, // Light Blue
    [Gender.FEMININE]: { bg: "#FDF2F8", text: "#EC4899" }, // Light Pink
    [Gender.NEUTER]: { bg: "#F0FDFA", text: "#14B8A6" }, // Light Teal
  };
  return colors[gender];
};

export const getBorderColor = (color: string) => (theme: any) =>
  alpha(color, 0.2);
