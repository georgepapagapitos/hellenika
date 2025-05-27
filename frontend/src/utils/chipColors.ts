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
    [WordType.PREFIX]: { bg: "#FDF2F8", text: "#EC4899" }, // Light Pink
  };
  return colors[type];
};

export const getGenderColor = (gender: Gender) => {
  const colors: Record<Gender, { bg: string; text: string }> = {
    [Gender.MASCULINE]: { bg: "#F1F5F9", text: "#64748B" }, // Cool Gray
    [Gender.FEMININE]: { bg: "#FDF4FF", text: "#C026D3" }, // Soft Purple
    [Gender.NEUTER]: { bg: "#F0FDF4", text: "#16A34A" }, // Soft Green
  };
  return colors[gender];
};

export const getBorderColor = (color: string) => (theme: any) =>
  alpha(color, 0.2);
