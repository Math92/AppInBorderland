// ThreeSpades.jsx
import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { SPADE_GAMES } from '../types.js';
import PlayingCard from '../../components/Card/PlayingCard';
import styles from './ThreeSpades.module.css';

const GAME_BUTTONS = ['↑', '↓', '←', '→'];
const COMBO_LENGTH = 4;

const generateRandomCombo = () => 
  Array(COMBO_LENGTH).fill()
    .map(() => GAME_BUTTONS[Math.floor(Math.random() * GAME_BUTTONS.length)]);

const ThreeSpades = () => {
  const { updateResults } = useGame();
  const gameConfig = SPADE_GAMES.THREE;
  const timerRef = useRef(null);
  
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [currentCombo, setCurrentCombo] = useState([]);
  const [targetCombo, setTargetCombo] = useState(generateRandomCombo);
  const [isFinished, setIsFinished] = useState(false);
  const [shouldUpdateResults, setShouldUpdateResults] = useState(false);

  // Efecto para manejar la finalización del juego
  useEffect(() => {
    if (shouldUpdateResults) {
      updateResults({
        score,
        success: score >= gameConfig.minCombos
      });
      setShouldUpdateResults(false);
    }
  }, [shouldUpdateResults, score, gameConfig.minCombos, updateResults]);

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

  const generateNewCombo = () => {
    setTargetCombo(generateRandomCombo());
    setCurrentCombo([]);
  };

  const handleButton = (button) => {
    if (isFinished) return;

    const newCombo = [...currentCombo, button];
    setCurrentCombo(newCombo);

    if (newCombo[newCombo.length - 1] !== targetCombo[newCombo.length - 1]) {
      // Combo incorrecto
      setTimeout(() => setCurrentCombo([]), 200);
      return;
    }

    if (newCombo.length === targetCombo.length) {
      // Combo completado correctamente
      setScore(prev => prev + 1);
      setTimeout(generateNewCombo, 500);
    }
  };

  return (
    <div className={styles.container}>
      <PlayingCard cardId="3-spades" />
      <div className={styles.header}>
        {gameConfig.name} | Tiempo: {timeLeft}s | Combos: {score}/{gameConfig.minCombos}
      </div>

      {!isFinished && (
        <div className={styles.gameArea}>
          <div className={styles.comboDisplay}>
            <div className={styles.comboRow}>
              {targetCombo.map((button, i) => (
                <div key={i} className={styles.comboButton}>{button}</div>
              ))}
            </div>
            <div className={styles.comboRow}>
              {targetCombo.map((_, i) => (
                <div key={i} className={`
                  ${styles.comboButton}
                  ${currentCombo[i] === targetCombo[i] ? styles.correct : ''}
                  ${currentCombo[i] && currentCombo[i] !== targetCombo[i] ? styles.wrong : ''}
                `}>
                  {currentCombo[i] || '?'}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.controls}>
            <button onClick={() => handleButton('↑')} className={styles.arrow}>↑</button>
            <div className={styles.middleRow}>
              <button onClick={() => handleButton('←')} className={styles.arrow}>←</button>
              <div className={styles.center} />
              <button onClick={() => handleButton('→')} className={styles.arrow}>→</button>
            </div>
            <button onClick={() => handleButton('↓')} className={styles.arrow}>↓</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeSpades;