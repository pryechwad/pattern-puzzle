interface GameInfoProps {
  currentLevel: number;
  score: number;
  timeLeft: number;
  gamePhase: 'watching' | 'selecting' | 'feedback';
  darkMode: boolean;
}

const levelNames = [
  'Even Indices',
  'Diagonals', 
  'Prime Numbers',
  'Center Cluster',
  'Modulo Magic'
];

export const GameInfo = ({ currentLevel, score, timeLeft, gamePhase, darkMode }: GameInfoProps) => {
  const levelName = levelNames[currentLevel - 1] || 'Unknown';
  
  return (
    <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Level {currentLevel}</h2>
        <div className="text-xl font-semibold">Score: {score}</div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-blue-600">{levelName}</h3>
        <p className="text-sm text-gray-600">Find the pattern in the flashing squares</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          gamePhase === 'watching' ? 'bg-yellow-100 text-yellow-800' :
          gamePhase === 'selecting' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {gamePhase === 'watching' ? 'Watch Pattern' :
           gamePhase === 'selecting' ? 'Select Squares' : 'Feedback'}
        </div>
        
        <div className="text-lg font-mono">
          Time: {timeLeft}s
        </div>
      </div>
    </div>
  );
};
