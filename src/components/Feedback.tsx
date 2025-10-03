interface FeedbackProps {
  userSelection: boolean[];
  correctPattern: boolean[];
  score: number;
  darkMode: boolean;
}

export const Feedback = ({ userSelection, correctPattern, darkMode }: Omit<FeedbackProps, 'score'>) => {
  const correctCount = userSelection.filter((selected, i) => selected === correctPattern[i]).length;
  const accuracy = Math.round((correctCount / 25) * 100);
  
  const correctSelections = userSelection.filter((selected, i) => selected && correctPattern[i]).length;
  const incorrectSelections = userSelection.filter((selected, i) => selected && !correctPattern[i]).length;
  const missedSelections = correctPattern.filter((correct, i) => correct && !userSelection[i]).length;

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
      <h3 className="text-lg font-bold mb-3">Results</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-green-500">✅</span>
          <span>Correct: {correctSelections}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-red-500">❌</span>
          <span>Wrong: {incorrectSelections}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">⚠️</span>
          <span>Missed: {missedSelections}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-blue-500">📊</span>
          <span>Accuracy: {accuracy}%</span>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <span className="text-lg font-semibold">Score: +{Math.floor(accuracy)}</span>
      </div>
    </div>
  );
};