import { useState } from 'react';

export const useGame = () => {
  const [gameState, setGameState] = useState({
    currentLevel: 1,
    score: 0,
    gamePhase: 'selecting' as 'watching' | 'selecting' | 'feedback',
    timeLeft: 30,
    userSelection: new Array(25).fill(false),
    correctPattern: new Array(25).fill(false).map((_, i) => i % 2 === 0),
    showingAnswer: false
  });

  const [flashingCells] = useState<boolean[]>(new Array(25).fill(false));
  const [darkMode, setDarkMode] = useState(false);

  const toggleCell = (index: number) => {
    if (gameState.gamePhase !== 'selecting') return;
    
    setGameState(prev => ({
      ...prev,
      userSelection: prev.userSelection.map((selected, i) => 
        i === index ? !selected : selected
      )
    }));
  };

  const submitAnswer = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'feedback',
      showingAnswer: true
    }));
  };

  const nextLevel = () => {
    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      gamePhase: 'selecting',
      userSelection: new Array(25).fill(false),
      showingAnswer: false
    }));
  };

  const restartGame = () => {
    setGameState({
      currentLevel: 1,
      score: 0,
      gamePhase: 'selecting',
      timeLeft: 30,
      userSelection: new Array(25).fill(false),
      correctPattern: new Array(25).fill(false).map((_, i) => i % 2 === 0),
      showingAnswer: false
    });
  };

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return {
    gameState,
    flashingCells,
    darkMode,
    toggleCell,
    submitAnswer,
    nextLevel,
    restartGame,
    toggleTheme
  };
};
