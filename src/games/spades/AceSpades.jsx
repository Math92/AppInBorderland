// AceSpades.jsx
import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { SPADE_GAMES } from '../types.js';
import styles from './AceSpades.module.css';

const AceSpades = () => {
  const { updateResults } = useGame();
  const gameConfig = SPADE_GAMES.ACE;
  
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);

  const handleGameEnd = useCallback(() => {
    setIsFinished(true);
    updateResults({
      score: clicks,
      success: clicks >= gameConfig.minScore
    });
  }, [clicks, updateResults, gameConfig.minScore]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleGameEnd]);

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

      {!isFinished ? (
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
        </div>
      ) : null}
    </div>
  );
};

export default AceSpades;