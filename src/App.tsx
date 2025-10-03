import { useState, useEffect } from 'react'
import './App.css'

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'from-green-500 to-emerald-600' : 
                  type === 'error' ? 'from-red-500 to-pink-600' : 
                  'from-blue-500 to-purple-600';
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl backdrop-blur-lg border-2 shadow-2xl animate-toast-in max-w-sm`}>
      <div className={`bg-gradient-to-r ${bgColor} p-4 rounded-xl text-white font-bold text-center`}>
        {message}
      </div>
    </div>
  );
};

// Game info component
const GameInfo = ({ darkMode }: { darkMode: boolean }) => (
  <div className={`p-4 sm:p-6 rounded-2xl backdrop-blur-lg border animate-slide-up ${
    darkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-white/40 border-white/50 text-gray-800'
  }`}>
    <h3 className="text-lg sm:text-xl font-bold mb-3 text-center">🎮 How to Play</h3>
    <div className="space-y-2 text-sm sm:text-base">
      <p>👀 <strong>Watch:</strong> Observe the flashing pattern (10s)</p>
      <p>🎯 <strong>Select:</strong> Click squares that were flashing (30s)</p>
      <p>📊 <strong>Score:</strong> Get points based on accuracy</p>
      <p>🏆 <strong>Progress:</strong> Complete 5 challenging levels</p>
    </div>
  </div>
);

// Game levels and rules
const levels = [
  {
    id: 1,
    name: "Even Indices",
    description: "Squares at even positions flash",
    emoji: "🔢",
    color: "from-blue-500 to-cyan-500",
    rule: (index: number) => index % 2 === 0
  },
  {
    id: 2,
    name: "Diagonals", 
    description: "Main and anti-diagonal squares flash",
    emoji: "⚡",
    color: "from-purple-500 to-pink-500",
    rule: (index: number) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      return row === col || row + col === 4;
    }
  },
  {
    id: 3,
    name: "Prime Numbers",
    description: "Squares at prime indices flash",
    emoji: "🔥",
    color: "from-red-500 to-orange-500",
    rule: (index: number) => {
      if (index < 2) return false;
      for (let i = 2; i <= Math.sqrt(index); i++) {
        if (index % i === 0) return false;
      }
      return true;
    }
  },
  {
    id: 4,
    name: "Center Cluster",
    description: "Center square and its neighbors flash",
    emoji: "💎",
    color: "from-green-500 to-emerald-500",
    rule: (index: number) => [6, 7, 8, 11, 12, 13, 16, 17, 18].includes(index)
  },
  {
    id: 5,
    name: "Modulo Magic",
    description: "Squares where (row + col) % 3 = 0 flash",
    emoji: "✨",
    color: "from-yellow-500 to-amber-500",
    rule: (index: number) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      return (row + col) % 3 === 0;
    }
  }
];

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gamePhase, setGamePhase] = useState<'watching' | 'selecting' | 'feedback'>('watching');
  const [timeLeft, setTimeLeft] = useState(10);
  const [userSelection, setUserSelection] = useState<boolean[]>(new Array(25).fill(false));
  const [correctPattern, setCorrectPattern] = useState<boolean[]>(new Array(25).fill(false));
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [flashingCells, setFlashingCells] = useState<boolean[]>(new Array(25).fill(false));
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('patternPuzzle-darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('patternPuzzle-gameState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setCurrentLevel(parsed.currentLevel || 1);
      setScore(parsed.score || 0);
      // Don't restore game phase to avoid mid-game state issues
    }
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    const gameState = {
      currentLevel,
      score,
      timestamp: Date.now()
    };
    localStorage.setItem('patternPuzzle-gameState', JSON.stringify(gameState));
  }, [currentLevel, score]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('patternPuzzle-darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Generate pattern for current level
  const generatePattern = () => {
    const level = levels[currentLevel - 1];
    const pattern = new Array(25).fill(false);
    
    for (let i = 0; i < 25; i++) {
      pattern[i] = level.rule(i);
    }
    
    return pattern;
  };

  // Start flashing animation
  const startFlashing = () => {
    const pattern = generatePattern();
    setCorrectPattern(pattern);
    setGamePhase('watching');
    setTimeLeft(10);
    setShowingAnswer(false);
    setUserSelection(new Array(25).fill(false));

    let flashCount = 0;
    const flashInterval = setInterval(() => {
      setFlashingCells(new Array(25).fill(false));
      
      setTimeout(() => {
        setFlashingCells(pattern);
      }, 100);
      
      flashCount++;
      if (flashCount >= 10) {
        clearInterval(flashInterval);
        setFlashingCells(new Array(25).fill(false));
        setGamePhase('selecting');
        setTimeLeft(30);
      }
    }, 1000);
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && (gamePhase === 'watching' || gamePhase === 'selecting')) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'selecting') {
      submitAnswer();
    }
  }, [timeLeft, gamePhase]);

  // Start game on mount
  useEffect(() => {
    startFlashing();
  }, [currentLevel]);

  const toggleCell = (index: number) => {
    if (gamePhase !== 'selecting') return;
    
    setUserSelection((prev: boolean[]) => 
      prev.map((selected, i) => i === index ? !selected : selected)
    );
  };

  const submitAnswer = () => {
    const correctCount = userSelection.filter((selected, i) => 
      selected === correctPattern[i]
    ).length;
    
    const scoreGain = Math.floor((correctCount / 25) * 100);
    const accuracy = Math.round((correctCount / 25) * 100);
    
    setGamePhase('feedback');
    setShowingAnswer(true);
    setScore((prev: number) => prev + scoreGain);
    
    // Show toast notification
    if (accuracy >= 80) {
      showToast(`🎉 Excellent! Score: +${scoreGain} (${accuracy}% accuracy)`, 'success');
    } else if (accuracy >= 60) {
      showToast(`👍 Good job! Score: +${scoreGain} (${accuracy}% accuracy)`, 'info');
    } else {
      showToast(`💪 Keep trying! Score: +${scoreGain} (${accuracy}% accuracy)`, 'error');
    }
  };

  const nextLevel = () => {
    const newLevel = currentLevel < levels.length ? currentLevel + 1 : 1;
    setCurrentLevel(newLevel);
    
    if (newLevel === 1) {
      showToast('🎊 All levels completed! Starting over...', 'success');
    } else {
      showToast(`🚀 Level ${newLevel} unlocked!`, 'info');
    }
  };

  const restartGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setGamePhase('watching');
    setTimeLeft(10);
    setUserSelection(new Array(25).fill(false));
    setCorrectPattern(new Array(25).fill(false));
    setShowingAnswer(false);
    setFlashingCells(new Array(25).fill(false));
    
    // Clear saved progress
    localStorage.removeItem('patternPuzzle-gameState');
    showToast('🔄 Game restarted! Progress cleared!', 'info');
  };

  const toggleTheme = () => {
    setDarkMode((prev: boolean) => !prev);
  };

  const hasSelection = userSelection.some(selected => selected);
  const level = levels[currentLevel - 1];

  return (
    <div className={`min-h-screen p-2 sm:p-4 lg:p-8 transition-all duration-500 relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'
    }`}>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <div className={`absolute top-10 sm:top-20 left-10 sm:left-20 w-32 sm:w-72 h-32 sm:h-72 rounded-full blur-2xl sm:blur-3xl animate-pulse ${
          darkMode ? 'bg-neon-blue' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000 ${
          darkMode ? 'bg-neon-purple' : 'bg-purple-300'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-32 sm:w-64 h-32 sm:h-64 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-500 ${
          darkMode ? 'bg-neon-pink' : 'bg-pink-300'
        }`}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-6 sm:mb-12 animate-slide-up">
          <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black mb-2 sm:mb-4 animate-glow ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            🧩 <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              PATTERN PUZZLE
            </span>
          </h1>
          <p className={`text-sm sm:text-xl font-medium px-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            🎯 Watch • 🧠 Decode • ✨ Conquer the Pattern!
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Left sidebar - Game Info (hidden on mobile, shown on xl screens) */}
          <div className="hidden xl:block xl:col-span-1">
            <GameInfo darkMode={darkMode} />
            
            {/* Stats */}
            <div className={`mt-6 p-4 rounded-2xl backdrop-blur-lg border ${
              darkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-white/40 border-white/50 text-gray-800'
            }`}>
              <h3 className="text-lg font-bold mb-3 text-center">📊 Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Current Level:</span>
                  <span className="font-bold">{currentLevel}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Score:</span>
                  <span className="font-bold">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phase:</span>
                  <span className="font-bold capitalize">{gamePhase}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main game area */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Game Info */}
            <div className={`relative p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-lg border animate-bounce-in ${
              darkMode 
                ? 'bg-gray-800/30 border-gray-700/50 text-white shadow-2xl shadow-purple-500/20' 
                : 'bg-white/40 border-white/50 text-gray-800 shadow-2xl shadow-blue-500/20'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className={`text-2xl sm:text-4xl animate-bounce bg-gradient-to-r ${level.color} p-2 sm:p-3 rounded-xl sm:rounded-2xl`}>
                    {level.emoji}
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black">Level {currentLevel}</h2>
                    <div className={`text-sm sm:text-lg font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                      {level.name}
                    </div>
                  </div>
                </div>
                <div className={`text-xl sm:text-2xl lg:text-3xl font-black px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-sm ${
                  darkMode ? 'bg-gray-700/50' : 'bg-white/50'
                }`}>
                  💎 {score}
                </div>
              </div>
              
              <div className="mb-4 sm:mb-6">
                <p className={`text-sm sm:text-lg font-medium text-center sm:text-left ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{level.description}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <div className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-lg font-bold backdrop-blur-sm border-2 animate-pulse-glow ${
                  gamePhase === 'watching' ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300' :
                  gamePhase === 'selecting' ? 'bg-blue-500/20 border-blue-400 text-blue-300' :
                  'bg-green-500/20 border-green-400 text-green-300'
                }`}>
                  {gamePhase === 'watching' ? '👀 Watch Pattern' :
                   gamePhase === 'selecting' ? '🎯 Select Squares' : '📊 Results'}
                </div>
                
                <div className={`text-lg sm:text-xl lg:text-2xl font-mono font-black px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-sm ${
                  timeLeft <= 5 ? 'animate-pulse bg-red-500/20 text-red-400' :
                  darkMode ? 'bg-gray-700/50 text-white' : 'bg-white/50 text-gray-800'
                }`}>
                  ⏱️ {timeLeft}s
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="flex justify-center animate-slide-up">
              <div className={`grid grid-cols-5 gap-1 sm:gap-2 lg:gap-3 p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-lg border-2 shadow-2xl ${
                darkMode 
                  ? 'bg-gray-800/20 border-gray-600/30 shadow-purple-500/20' 
                  : 'bg-white/30 border-white/40 shadow-blue-500/20'
              }`}>
                {Array.from({ length: 25 }, (_, index) => {
                  const isCorrect = showingAnswer && correctPattern[index] && userSelection[index];
                  const isIncorrect = showingAnswer && userSelection[index] && !correctPattern[index];
                  const isMissed = showingAnswer && correctPattern[index] && !userSelection[index];
                  
                  let cellClass = "w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-2 rounded-lg sm:rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-center text-xs sm:text-sm lg:text-lg font-black transform hover:scale-105 active:scale-95";
                  
                  if (gamePhase === 'watching' || gamePhase === 'feedback') {
                    cellClass += " cursor-not-allowed";
                  }
                  
                  if (gamePhase === 'watching' && flashingCells[index]) {
                    cellClass += " bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 shadow-xl sm:shadow-2xl shadow-yellow-500/50 scale-110 animate-flash-neon text-white";
                  } else if (gamePhase === 'selecting' && userSelection[index]) {
                    cellClass += " bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 shadow-lg sm:shadow-xl shadow-blue-500/50 text-white scale-105";
                  } else if (isCorrect) {
                    cellClass += " bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-lg sm:shadow-xl shadow-green-500/50 text-white animate-bounce-in";
                  } else if (isIncorrect) {
                    cellClass += " bg-gradient-to-br from-red-500 to-pink-600 border-red-400 shadow-lg sm:shadow-xl shadow-red-500/50 text-white animate-bounce-in";
                  } else if (isMissed) {
                    cellClass += " bg-gradient-to-br from-yellow-500 to-amber-600 border-yellow-400 shadow-lg sm:shadow-xl shadow-yellow-500/50 text-white animate-bounce-in";
                  } else {
                    cellClass += darkMode 
                      ? " bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 hover:from-gray-600 hover:to-gray-700 text-gray-300 shadow-md sm:shadow-lg" 
                      : " bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 hover:from-gray-200 hover:to-gray-300 text-gray-700 shadow-md sm:shadow-lg";
                  }
                  
                  return (
                    <button
                      key={index}
                      className={cellClass}
                      onClick={() => toggleCell(index)}
                      disabled={gamePhase === 'watching' || gamePhase === 'feedback'}
                    >
                      {index}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback */}
            {gamePhase === 'feedback' && (
              <div className={`p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-lg border-2 shadow-2xl animate-bounce-in ${
                darkMode 
                  ? 'bg-gray-800/30 border-gray-600/30 text-white shadow-purple-500/20' 
                  : 'bg-white/40 border-white/40 text-gray-800 shadow-blue-500/20'
              }`}>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 sm:mb-6 text-center bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  🎯 MISSION RESULTS
                </h3>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-500/20 border border-green-400/50">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">✅</div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-black text-green-400">
                      {userSelection.filter((selected, i) => selected && correctPattern[i]).length}
                    </div>
                    <div className="text-xs sm:text-sm font-medium">Correct</div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-500/20 border border-red-400/50">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">❌</div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-black text-red-400">
                      {userSelection.filter((selected, i) => selected && !correctPattern[i]).length}
                    </div>
                    <div className="text-xs sm:text-sm font-medium">Wrong</div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-yellow-500/20 border border-yellow-400/50">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">⚠️</div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-black text-yellow-400">
                      {correctPattern.filter((correct, i) => correct && !userSelection[i]).length}
                    </div>
                    <div className="text-xs sm:text-sm font-medium">Missed</div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-500/20 border border-blue-400/50">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">📊</div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-black text-blue-400">
                      {Math.round((userSelection.filter((selected, i) => selected === correctPattern[i]).length / 25) * 100)}%
                    </div>
                    <div className="text-xs sm:text-sm font-medium">Accuracy</div>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 justify-center items-center">
              {gamePhase === 'selecting' && (
                <button
                  onClick={submitAnswer}
                  disabled={!hasSelection}
                  className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    hasSelection
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl sm:shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 animate-pulse-glow'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  🚀 SUBMIT
                </button>
              )}
              
              {gamePhase === 'feedback' && (
                <button
                  onClick={nextLevel}
                  className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg shadow-xl sm:shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-pulse-glow"
                >
                  ⚡ NEXT
                </button>
              )}
              
              <button
                onClick={restartGame}
                className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                🔄 RESTART
              </button>
              
              <button
                onClick={toggleTheme}
                className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
            
            {/* Mobile Game Info */}
            <div className="xl:hidden">
              <GameInfo darkMode={darkMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
