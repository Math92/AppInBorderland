// AceSpades.jsx
import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { SPADE_GAMES } from '../types.js';
import styles from './AceSpades.module.css';

const AceSpades = () => {
  const { updateResults } = useGame();
  const gameConfig = SPADE_GAMES.ACE;
  
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);
  
  // Usar useRef para tracking del timer
  const timerRef = useRef(null);

  // Manejar la finalización del juego
  useEffect(() => {
    if (isFinished && !timerRef.current) {
      updateResults({
        score: clicks,
        success: clicks >= gameConfig.minScore
      });
    }
  }, [isFinished, clicks, updateResults, gameConfig.minScore]);

  // Timer del juego
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (!isFinished) {
      setClicks(prev => prev + 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {gameConfig.name} | Tiempo: {timeLeft}s | Golpes: {clicks}
      </div>

      {!isFinished && (
        <div className={styles.gameArea}>
          <button
            onClick={handleClick}
            className={styles.clickButton}
          >
            ¡GOLPEA!
          </button>

          <div className={styles.progressBar}>
            <div 
              className={styles.progress}
              style={{ width: `${(clicks / gameConfig.minScore) * 100}%` }}
            />
          </div>

          <div className={styles.gameInfo}>
            <span>Objetivo: {gameConfig.minScore} golpes</span>
            <span>Progreso: {Math.floor((clicks / gameConfig.minScore) * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AceSpades;