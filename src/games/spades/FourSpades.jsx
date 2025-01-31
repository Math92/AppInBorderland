import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { SPADE_GAMES } from '../types.js';
import PlayingCard from '../../components/Card/PlayingCard.jsx';
import styles from './FourSpades.module.css';

const FourSpades = () => {
  const { updateResults } = useGame();
  const gameConfig = SPADE_GAMES.FOUR;
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const spawnTimerRef = useRef(null);
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);
  const [buttons, setButtons] = useState([]);

  // Configuración del juego
  const SPAWN_INTERVAL = 800;
  const BUTTON_LIFETIME = 1300;

  // Generar nuevo botón
  const spawnButton = () => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newButton = {
      id: Date.now(),
      x: Math.random() * (containerRect.width - 60),
      y: Math.random() * (containerRect.height - 60),
    };

    setButtons(prev => [...prev, newButton]);
    
    setTimeout(() => {
      setButtons(prev => prev.filter(btn => btn.id !== newButton.id));
    }, BUTTON_LIFETIME);
  };

  // Manejar click en botón
  const handleButtonClick = (id) => {
    setScore(prev => prev + 1);
    setButtons(prev => prev.filter(btn => btn.id !== id));
  };

  // Efecto para el temporizador principal
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          clearInterval(spawnTimerRef.current);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(spawnTimerRef.current);
    };
  }, []);

  // Efecto para spawn de botones
  useEffect(() => {
    if (!isFinished) {
      spawnTimerRef.current = setInterval(spawnButton, SPAWN_INTERVAL);
    }
    return () => clearInterval(spawnTimerRef.current);
  }, [isFinished]);

  // Actualizar resultados
  useEffect(() => {
    if (isFinished) {
      updateResults({
        score,
        success: score >= gameConfig.minTarget
      });
    }
  }, [isFinished, score, updateResults, gameConfig.minTarget]);

  return (
    <div className={styles.container} ref={containerRef}>
      <PlayingCard cardId="four-spades" />
      <div className={styles.header}>
        {gameConfig.name} | Tiempo: {timeLeft}s | Objetivos: {score}/{gameConfig.minTarget}
      </div>

      {!isFinished && (
        <div className={styles.gameArea}>
          {buttons.map(button => (
            <button
              key={button.id}
              className={styles.targetButton}
              style={{
                left: button.x,
                top: button.y,
              }}
              onClick={() => handleButtonClick(button.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FourSpades;