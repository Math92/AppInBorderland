// TwoSpades.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { SPADE_GAMES } from '../types.js';
import styles from './TwoSpades.module.css';

const TwoSpades = () => {
  const { updateResults } = useGame();
  const gameConfig = SPADE_GAMES.TWO;
  
  const [power, setPower] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [maxPower, setMaxPower] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Timer para el juego
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setIsFinished(true);
          updateResults({
            score: maxPower,
            success: maxPower >= gameConfig.minPower 
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [maxPower, gameConfig.minPower, updateResults]);

  // Control de poder
  useEffect(() => {
    let powerInterval;
    
    if (isHolding && !isFinished) {
      powerInterval = setInterval(() => {
        if (power < 100) {
          setPower(current => {
            const newPower = Math.min(current + 2, 100);
            setMaxPower(prev => Math.max(prev, newPower));
            return newPower;
          });
        }
      }, 100);
    } else if (!isHolding) {
      powerInterval = setInterval(() => {
        setPower(prev => Math.max(prev - 4, 0));
      }, 100);
    }

    return () => {
      if (powerInterval) clearInterval(powerInterval);
    };
  }, [isHolding, isFinished, power]);

  const handleMouseDown = () => {
    if (!isFinished) setIsHolding(true);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
  };

  const handleMouseLeave = () => {
    setIsHolding(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {gameConfig.name} | Tiempo: {timeLeft}s | Máximo: {maxPower}%
      </div>

      {!isFinished ? (
        <div className={styles.gameArea}>
          <div className={styles.powerBar}>
            <div 
              className={`${styles.powerIndicator} ${styles[`power${Math.floor(power/25)}`]}`}
              style={{ width: `${power}%` }}
            />
          </div>

          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={`${styles.holdButton} ${isHolding ? styles.holding : ''}`}
          >
            {isHolding ? '¡MANTÉN!' : 'PRESIONA'}
          </button>
        </div>
      ) : (
        <div className={styles.results}>
          <h2>{maxPower >= gameConfig.minPower ? '¡Victoria!' : 'Derrota'}</h2>
          <p>Poder máximo: {maxPower}%</p>
          <p>Objetivo: {gameConfig.minPower}%</p>
        </div>
      )}
    </div>
  );
};

export default TwoSpades;