// TwoDiamonds.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { DIAMOND_GAMES } from '../types.js';
import styles from './TwoDiamonds.module.css';
import PlayingCard from '../../components/Card/PlayingCard';

const gameConfig = {
  ...DIAMOND_GAMES.TWO,
  maxLevels: 2,
  maxTime: 15, // 15 seconds to respond
  showPatternTime: 4000, // 4 seconds to show the pattern
  maxAttempts: 2, // Maximum number of incorrect attempts allowed
};

const SYMBOLS = ['♠', '♣', '♥', '♦'];
const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#9333ea'];

const generatePattern = (level) => {
  // Ensure the length is at least 4 and increases with level
  const length = Math.max(4, level + 3);
  const selectedSymbols = [];
  
  // Ensure all 4 symbols are used at least once
  const symbolsCopy = [...SYMBOLS];
  while (symbolsCopy.length > 0) {
    const symbolIndex = Math.floor(Math.random() * symbolsCopy.length);
    const symbol = symbolsCopy.splice(symbolIndex, 1)[0];
    selectedSymbols.push({
      symbol,
      color: COLORS[SYMBOLS.indexOf(symbol)]
    });
  }
  
  // Fill the rest of the pattern with random symbols
  while (selectedSymbols.length < length) {
    const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    selectedSymbols.push({
      symbol: randomSymbol,
      color: COLORS[SYMBOLS.indexOf(randomSymbol)]
    });
  }
  
  return selectedSymbols;
};

const TwoDiamonds = () => {
  const { updateResults } = useGame();
  const [gameState, setGameState] = useState('READY');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [pattern, setPattern] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);

  const startLevel = () => {
    // Clear previous state
    setPlayerInput([]);
    setTimeLeft(gameConfig.maxTime);
    setIncorrectAttempts(0);
    
    // Generate new pattern
    const newPattern = generatePattern(currentLevel);
    setPattern(newPattern);
    
    // Start sequence
    setGameState('SHOWING_PATTERN');

    // After pattern time, hide pattern and allow input
    setTimeout(() => {
      setGameState('INPUT');
    }, gameConfig.showPatternTime);
  };

  // Start the game
  useEffect(() => {
    if (gameState === 'READY') {
      startLevel();
    }
  }, [gameState]);

  // Timer effect
  useEffect(() => {
    let timer;
    
    if (gameState === 'INPUT') {
      // Ensure we start with max time
      setTimeLeft(gameConfig.maxTime);
      
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('FINISHED');
            updateResults({
              score,
              success: false
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  
    // Clear timer when state changes or component unmounts
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, updateResults, score]);

  const resetCurrentLevelAttempt = () => {
    setPlayerInput([]);
    setIncorrectAttempts(prev => prev + 1);
  };

  const handleSymbolClick = (symbol, color) => {
    if (gameState !== 'INPUT') return;

    const newInput = [...playerInput, { symbol, color }];
    setPlayerInput(newInput);

    // Check if the current input matches the pattern up to the current length
    const isCurrentInputCorrect = newInput.every((input, index) => 
      input.symbol === pattern[index].symbol && 
      input.color === pattern[index].color
    );

    if (!isCurrentInputCorrect) {
      // Incorrect sequence 
      if (incorrectAttempts + 1 >= gameConfig.maxAttempts) {
        // Too many incorrect attempts
        setGameState('FINISHED');
        updateResults({
          score,
          success: false
        });
        return;
      }
      
      // Reset current attempt
      resetCurrentLevelAttempt();
      return;
    }

    // Check if the full sequence is complete and uses all symbols
    if (newInput.length === pattern.length) {
      const uniqueSymbols = new Set(newInput.map(item => item.symbol));
      
      if (uniqueSymbols.size === 4) {
        // Correct sequence using all symbols
        const levelScore = Math.floor((timeLeft / gameConfig.maxTime) * 100);
        const newScore = score + levelScore + gameConfig.baseScore;
        setScore(newScore);

        if (currentLevel < gameConfig.maxLevels) {
          // Move to next level
          setCurrentLevel(prev => prev + 1);
          setTimeout(() => {
            startLevel();
          }, 1500);
        } else {
          // Game completed
          setTimeout(() => {
            setGameState('FINISHED');
            updateResults({
              score: newScore + (gameConfig.baseScore * currentLevel),
              success: true
            });
          }, 1500);
        }
      }
    }
  };

  const renderSymbolGrid = () => (
    <div className={styles.symbolGrid}>
      {SYMBOLS.map((symbol, i) => (
        <button
          key={symbol}
          className={styles.symbolButton}
          style={{ color: COLORS[i] }}
          onClick={() => handleSymbolClick(symbol, COLORS[i])}
          disabled={gameState !== 'INPUT'}
        >
          {symbol}
        </button>
      ))}
    </div>
  );

  const renderPattern = () => (
    <div className={styles.patternContainer}>
      {pattern.map((item, index) => (
        <div
          key={index}
          className={styles.patternSymbol}
          style={{ 
            color: gameState === 'SHOWING_PATTERN' ? item.color : 'transparent',
            opacity: gameState === 'SHOWING_PATTERN' ? 1 : 0.3
          }}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  );

  const renderPlayerInput = () => (
    <div className={styles.patternContainer}>
      {pattern.map((_, index) => (
        <div
          key={index}
          className={styles.patternSymbol}
          style={{
            color: playerInput[index]?.color || '#cbd5e1',
            opacity: playerInput[index] ? 1 : 0.3
          }}
        >
          {playerInput[index]?.symbol || '?'}
        </div>
      ))}
    </div>
  );

  const renderGameContent = () => {
    switch (gameState) {
      case 'SHOWING_PATTERN':
        return (
          <>
            <div className={styles.status}>
              <h3>¡Memoriza el patrón!</h3>
              <p>Tiempo de memorización: {gameConfig.showPatternTime / 1000}s</p>
            </div>
            {renderPattern()}
          </>
        );
      case 'INPUT':
        return (
          <>
            <div className={styles.status}>
              <h3>¡Reproduce el patrón!</h3>
              <p className={styles.timer}>Tiempo restante: {timeLeft}s</p>
              <p>Usa los 4 símbolos en el orden correcto</p>
              <p>Intentos restantes: {gameConfig.maxAttempts - incorrectAttempts}</p>
            </div>
            {renderPlayerInput()}
            {renderSymbolGrid()}
          </>
        );
      case 'FINISHED':
        return (
          <div className={styles.results}>
            <h3>Juego Terminado</h3>
            <div className={styles.finalScore}>
              Puntuación Final: {score}
            </div>
            <div className={styles.feedback}>
              {score >= gameConfig.minScore
                ? "¡Excelente memoria y concentración!"
                : "Sigue practicando tu memoria de patrones."}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <PlayingCard cardId="2-diamonds" />
      <div className={styles.header}>
        ♦ {gameConfig.name} | Nivel: {currentLevel}/{gameConfig.maxLevels}
      </div>

      <div className={styles.gameArea}>
        {renderGameContent()}
      </div>
    </div>
  );
};

export default TwoDiamonds;