export enum WordType {
  NOUN = "noun",
  VERB = "verb",
  ADJECTIVE = "adjective",
  ADVERB = "adverb",
  PRONOUN = "pronoun",
  PREPOSITION = "preposition",
  CONJUNCTION = "conjunction",
  ARTICLE = "article",
  PREFIX = "prefix",
}

export enum Gender {
  MASCULINE = "masculine",
  FEMININE = "feminine",
  NEUTER = "neuter",
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface Meaning {
  id: number;
  english_meaning: string;
  is_primary: boolean;
  word_id: number;
}

export interface UserOut {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
}

export interface Word {
  id: number;
  greek_word: string;
  word_type: WordType;
  gender?: Gender;
  notes?: string;
  approval_status: ApprovalStatus;
  meanings: Meaning[];
  created_at?: string;
  created_by?: number;
  submitter?: UserOut;
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
  meanings: {
    english_meaning: string;
    is_primary: boolean;
  }[];
}
