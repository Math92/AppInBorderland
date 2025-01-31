// TwoSpades.jsx
import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { SPADE_GAMES } from '../types.js';
import styles from './TwoSpades.module.css';
import PlayingCard from '../../components/Card/PlayingCard.jsx';

const TwoSpades = () => {
  const { updateResults } = useGame();
  const gameConfig = SPADE_GAMES.TWO;
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  
  const [power, setPower] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);
  const [maxPower, setMaxPower] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [shouldUpdateResults, setShouldUpdateResults] = useState(false);

  // Efecto para manejar la finalización del juego
  useEffect(() => {
    if (shouldUpdateResults) {
      updateResults({
        score: maxPower,
        success: maxPower >= gameConfig.minPower
      });
      setShouldUpdateResults(false);
    }
  }, [shouldUpdateResults, maxPower, gameConfig.minPower, updateResults]);

  // Timer del juego
  useEffect(() => {
    if (isFinished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          setIsFinished(true);
          setShouldUpdateResults(true);
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
  }, [isFinished]);

  // Manejo del poder
  useEffect(() => {
    if (isFinished) return;

    if (isHolding) {
      intervalRef.current = setInterval(() => {
        setPower(currentPower => {
          const newPower = Math.min(currentPower + 2, 100);
          setMaxPower(prev => Math.max(prev, newPower));
          return newPower;
        });
      }, 50);
    } else {
      intervalRef.current = setInterval(() => {
        setPower(currentPower => Math.max(currentPower - 3, 0));
      }, 50);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
      <PlayingCard cardId="2-spades" />
      <div className={styles.header}>
        {gameConfig.name} | Tiempo: {timeLeft}s | Máximo: {maxPower}%
      </div>

      {!isFinished && (
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
      )}
    </div>
  );
};

export default TwoSpades;