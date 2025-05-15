export enum WordType {
  NOUN = "noun",
  VERB = "verb",
  ADJECTIVE = "adjective",
  ADVERB = "adverb",
  PRONOUN = "pronoun",
  PREPOSITION = "preposition",
  CONJUNCTION = "conjunction",
  ARTICLE = "article",
}

export enum Gender {
  MASCULINE = "masculine",
  FEMININE = "feminine",
  NEUTER = "neuter",
}

export interface Meaning {
  id?: number;
  english_meaning: string;
  is_primary: boolean;
  word_id?: number;
}

export interface Word {
  id?: number;
  greek_word: string;
  word_type: WordType;
  gender?: Gender;
  notes?: string;
  meanings: Meaning[];
}

export interface MeaningFormData {
  english_meaning: string;
  is_primary: boolean;
}

export interface WordFormData {
  greek_word: string;
  word_type: WordType;
  gender?: Gender;
  notes?: string;
  meanings: MeaningFormData[];
}
