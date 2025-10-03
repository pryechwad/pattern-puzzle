import { CellProps } from '../types/game';

export const Cell = ({ 
  index, 
  isFlashing, 
  isSelected, 
  isCorrect, 
  isIncorrect, 
  onClick, 
  disabled 
}: CellProps) => {
  const getClassName = () => {
    let baseClass = "w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center text-sm font-bold";
    
    if (disabled) baseClass += " cursor-not-allowed";
    if (isFlashing) baseClass += " bg-yellow-400 shadow-lg scale-105";
    if (isSelected) baseClass += " bg-blue-500 text-white";
    if (isCorrect) baseClass += " bg-green-500 text-white";
    if (isIncorrect) baseClass += " bg-red-500 text-white";
    
    if (!isFlashing && !isSelected && !isCorrect && !isIncorrect) {
      baseClass += " bg-gray-100 hover:bg-gray-200";
    }
    
    return baseClass;
  };

  return (
    <button
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
    >
      {index}
    </button>
  );
};