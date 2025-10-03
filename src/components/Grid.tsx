import { Cell } from './Cell';

interface GridProps {
  flashingCells: boolean[];
  userSelection: boolean[];
  correctPattern: boolean[];
  showingAnswer: boolean;
  gamePhase: 'watching' | 'selecting' | 'feedback';
  onCellClick: (index: number) => void;
}

export const Grid = ({ 
  flashingCells, 
  userSelection, 
  correctPattern, 
  showingAnswer, 
  gamePhase, 
  onCellClick 
}: GridProps) => {
  return (
    <div className="grid grid-cols-5 gap-2 p-4 bg-white rounded-xl shadow-lg">
      {Array.from({ length: 25 }, (_, index) => {
        const isCorrect = showingAnswer && correctPattern[index] && userSelection[index];
        const isIncorrect = showingAnswer && userSelection[index] && !correctPattern[index];
        
        return (
          <Cell
            key={index}
            index={index}
            isFlashing={gamePhase === 'watching' && flashingCells[index]}
            isSelected={gamePhase === 'selecting' && userSelection[index]}
            isCorrect={isCorrect}
            isIncorrect={isIncorrect}
            onClick={() => onCellClick(index)}
            disabled={gamePhase === 'watching' || gamePhase === 'feedback'}
          />
        );
      })}
    </div>
  );
};