interface ControlsProps {
  gamePhase: 'watching' | 'selecting' | 'feedback';
  onSubmit: () => void;
  onNextLevel: () => void;
  onRestart: () => void;
  onToggleTheme: () => void;
  darkMode: boolean;
  hasSelection: boolean;
}

export const Controls = ({ 
  gamePhase, 
  onSubmit, 
  onNextLevel, 
  onRestart, 
  onToggleTheme, 
  darkMode, 
  hasSelection 
}: ControlsProps) => {
  return (
    <div className="flex gap-4 justify-center items-center">
      {gamePhase === 'selecting' && (
        <button
          onClick={onSubmit}
          disabled={!hasSelection}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answer
        </button>
      )}
      
      {gamePhase === 'feedback' && (
        <button
          onClick={onNextLevel}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Next Level
        </button>
      )}
      
      <button
        onClick={onRestart}
        className="px-4 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
      >
        Restart
      </button>
      
      <button
        onClick={onToggleTheme}
        className="px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};