// TwoSpades.jsx
import { useState, useEffect, useCallback } from 'react';
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

  const handleGameEnd = useCallback(() => {
    setIsFinished(true);
    updateResults({
      score: maxPower,
      success: maxPower >= gameConfig.minPower
    });
  }, [maxPower, gameConfig.minPower, updateResults]);

  // Timer del juego
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [handleGameEnd]);

  // Manejo del poder
  useEffect(() => {
    if (isFinished) return;

    let intervalId;
    if (isHolding) {
      // Incrementar poder mientras se mantiene presionado
      intervalId = setInterval(() => {
        setPower(currentPower => {
          const newPower = Math.min(currentPower + 2, 100);
          setMaxPower(prev => Math.max(prev, newPower));
          return newPower;
        });
      }, 50);
    } else {
      // Decrementar poder cuando se suelta
      intervalId = setInterval(() => {
        setPower(currentPower => Math.max(currentPower - 3, 0));
      }, 50);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHolding, isFinished]);

  // Manejadores de eventos del mouse/touch
  const startHolding = () => {
    if (!isFinished) {
      setIsHolding(true);
    }
  };

  const stopHolding = () => {
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
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
            className={`${styles.holdButton} ${isHolding ? styles.holding : ''}`}
            disabled={isFinished}
          >
            {isHolding ? '¡MANTÉN!' : 'PRESIONA'}
          </button>

          <div className={styles.powerInfo}>
            <span>Poder actual: {power}%</span>
            <span>Objetivo: {gameConfig.minPower}%</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TwoSpades;