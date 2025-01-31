// AceSpades.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { SPADE_GAMES } from '../../data/types';
import styles from './AceSpades.module.css';

const AceSpades = () => {
  const { updateRoundResults } = useGame();
  const gameConfig = SPADE_GAMES.ACE;
  
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          setIsFinished(true);
          updateRoundResults({
            score: clicks,
            success: clicks >= gameConfig.minScore
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [clicks, updateRoundResults]);

  const handleClick = () => {
    if (!isFinished) setClicks(prev => prev + 1);
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
      ) : (
        <div className={styles.results}>
          <h2>{clicks >= gameConfig.minScore ? '¡Victoria!' : 'Derrota'}</h2>
          <p>Total de golpes: {clicks}</p>
          <p>Objetivo: {gameConfig.minScore}</p>
        </div>
      )}
    </div>
  );
};

export default AceSpades;