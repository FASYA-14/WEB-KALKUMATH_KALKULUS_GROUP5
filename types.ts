
export type CalculatorType = 'real' | 'limit' | 'derivative' | 'integral' | 'quiz';

export interface CalculationResult {
  expression: string;
  result: string;
  latex: string;
  explanation: string;
  plotData?: { x: number; y: number }[];
}

export interface QuizQuestion {
  id: number;
  category: CalculatorType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizScore {
  total: number;
  correct: number;
  history: { questionId: number; isCorrect: boolean }[];
}
