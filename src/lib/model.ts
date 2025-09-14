export type Choice = { id: string; label: string; isCorrect: boolean };
export type Question = {
  id: string;
  text: string;
  choices: Choice[];
  // metadata for UI
  round?: number;
  category?: string;
};

export type FlowKind = 'linear' | 'rounds';
export type Round = { id: string; title?: string; questionIds: string[] };

export interface QuizData {
  questions: Question[];
  rounds?: Round[]; // present for the "rounds" flow
}