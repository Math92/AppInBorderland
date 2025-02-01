// TwoDiamonds.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { DIAMOND_GAMES } from '../types.js';
import styles from './TwoDiamonds.module.css';
import PlayingCard from '../../components/Card/PlayingCard';

const gameConfig = {
    ...DIAMOND_GAMES.TWO,
    maxLevels: 2,
    maxTime: 15, // 15 segundos para responder
    showPatternTime: 4000, // 4 segundos para mostrar el patrón
  };

const SYMBOLS = ['♠', '♣', '♥', '♦'];
const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#9333ea'];

const generatePattern = (level) => {
    // Asegurar que la longitud es al menos 2
    const length = Math.max(2, level + 1);
    return Array.from({ length }, () => ({
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));
  };

const TwoDiamonds = () => {
  const { updateResults } = useGame();
  const [gameState, setGameState] = useState('READY');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [pattern, setPattern] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);

  const startLevel = () => {
    // Limpiar estado anterior
    setPlayerInput([]);
    setTimeLeft(gameConfig.maxTime);
    
    // Generar nuevo patrón
    const newPattern = generatePattern(currentLevel + 2);
    setPattern(newPattern);
    
    // Iniciar secuencia
    setGameState('SHOWING_PATTERN');

    // Después del tiempo, ocultar patrón y permitir input
    setTimeout(() => {
      setGameState('INPUT');
    }, gameConfig.showPatternTime);
  };

  // Iniciar el juego
  useEffect(() => {
    if (gameState === 'READY') {
      startLevel();
    }
  }, [gameState]);

   // Modificar el useEffect del timer
useEffect(() => {
    let timer;
    
    if (gameState === 'INPUT') {
      // Asegurarse que empezamos con el tiempo máximo
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
  
    // Limpiar el timer cuando cambie el estado o se desmonte el componente
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, updateResults, score]); // Agregar las dependencias necesarias

  const handleSymbolClick = (symbol, color) => {
    if (gameState !== 'INPUT') return;

    const newInput = [...playerInput, { symbol, color }];
    setPlayerInput(newInput);

    // Verificar si la secuencia es correcta hasta ahora
    const isCorrect = newInput.every((input, index) => 
      input.symbol === pattern[index].symbol && 
      input.color === pattern[index].color
    );

    if (!isCorrect) {
      // Secuencia incorrecta - Terminar juego
      setGameState('FINISHED');
      updateResults({
        score,
        success: false
      });
    } else if (newInput.length === pattern.length) {
      // Secuencia completa correcta
      const levelScore = Math.floor((timeLeft / gameConfig.maxTime) * 100);
      const newScore = score + levelScore + gameConfig.baseScore;
      setScore(newScore);

      if (currentLevel < gameConfig.maxLevels) {
        // Avanzar al siguiente nivel
        setCurrentLevel(prev => prev + 1);
        setTimeout(() => {
          startLevel();
        }, 1500);
      } else {
        // Juego completado
        setTimeout(() => {
          setGameState('FINISHED');
          updateResults({
            score: newScore + (gameConfig.baseScore * currentLevel),
            success: true
          });
        }, 1500);
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