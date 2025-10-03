export interface Level {
  id: number;
  name: string;
  description: string;
  rule: (index: number, row: number, col: number) => boolean;
}

export interface GameState {
  currentLevel: number;
  score: number;
  isFlashing: boolean;
  showingAnswer: boolean;
  userSelection: boolean[];
  correctPattern: boolean[];
  gamePhase: 'watching' | 'selecting' | 'feedback';
  timeLeft: number;
}

export interface CellProps {
  index: number;
  isFlashing: boolean;
  isSelected: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  onClick: () => void;
  disabled: boolean;
}