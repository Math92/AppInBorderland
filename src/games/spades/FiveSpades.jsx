// FiveSpades.jsx
import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { SPADE_GAMES } from '../types.js';
import PlayingCard from '../../components/Card/PlayingCard';
import styles from './FiveSpades.module.css';

const FiveSpades = () => {
  const { updateResults } = useGame();
  const gameConfig = SPADE_GAMES.FIVE;
  const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [beats, setBeats] = useState([]);
  const [isStarting, setIsStarting] = useState(true);
  const [countdown, setCountdown] = useState(3);
  
  const beatIdRef = useRef(0);
  const animationFrameRef = useRef();
  const intervalsRef = useRef([]);

  // Fin del juego cuando se acaba el tiempo
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsFinished(true);
      updateResults({
        score,
        success: score >= gameConfig.minScore
      });
    }
  }, [timeLeft, score, updateResults]);

  // Countdown inicial
  useEffect(() => {
    if (isStarting && countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    } else if (isStarting && countdown === 0) {
      setIsStarting(false);
      startGame();
    }
  }, [isStarting, countdown]);

  const startGame = () => {
    // Timer principal
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    // Generador de beats cada 3 segundos
    const beatInterval = setInterval(() => {
      const newBeat = {
        id: beatIdRef.current++,
        timing: Date.now(),
        hit: false
      };
      setBeats(prev => [...prev, newBeat]);
    }, 3000);

    // Animación simple de caída
    const animate = () => {
      if (!isFinished) {
        setBeats(currentBeats => {
          return currentBeats
            .filter(beat => {
              const elapsed = Date.now() - beat.timing;
              // Mantener beats hasta que lleguen al final (3 segundos)
              return elapsed < 3000;
            })
            .map(beat => {
              const elapsed = Date.now() - beat.timing;
              // Posición de 0 a 100
              const position = (elapsed / 3000) * 100;
              return { ...beat, position };
            });
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    intervalsRef.current.push(timer, beatInterval);
    
    return () => {
      intervalsRef.current.forEach(clearInterval);
      cancelAnimationFrame(animationFrameRef.current);
    };
  };

  // Simplificada la lógica de golpe
  const handleHit = () => {
    if (isFinished || isStarting) return;
    
    // Encontrar la bola más cercana a la zona de hit (70-85%)
    const targetBeat = beats.find(beat => {
      const pos = beat.position;
      // Zona de hit más grande y más abajo
      return !beat.hit && pos >= 70 && pos <= 85;
    });

    if (targetBeat) {
      setFeedback('¡BIEN! +100 🎯');
      setScore(prev => prev + 100);
      // Marcar como golpeada y mostrar efecto
      setBeats(prev => prev.map(b => 
        b.id === targetBeat.id ? { ...b, hit: true } : b
      ));
      
      // Mostrar feedback por más tiempo
      setTimeout(() => setFeedback(''), 800);
    } else {
      // Feedback opcional cuando fallas
      const anyCloseBeat = beats.find(beat => !beat.hit && beat.position > 50);
      if (anyCloseBeat) {
        setFeedback('¡Casi! ⚡️');
        setTimeout(() => setFeedback(''), 300);
      }
    }
  };

  if (isStarting) {
    return (
      <div className={styles.container}>
        <PlayingCard cardId="5-spades" />
        <div className={styles.startScreen}>
          <h2>¡Golpea al Ritmo!</h2>
          <div className={styles.countdown}>{countdown}</div>
          <div className={styles.tutorial}>
            <p>Golpea cuando los beats lleguen a la zona roja</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PlayingCard cardId="5-spades" />
      <div className={styles.header}>
        Tiempo: {timeLeft}s | Puntos: {score}
      </div>

      <div className={styles.gameArea}>
        <div className={styles.beatTrack}>
          {beats.map(beat => (
            <div
              key={beat.id}
              className={`${styles.beat} ${beat.hit ? styles.hit : ''}`}
              style={{ top: `${beat.position}%` }}
            />
          ))}
          <div className={styles.hitZone} />
        </div>

        <div className={styles.feedback}>
          {feedback}
        </div>

        <button 
          className={styles.hitButton}
          onClick={handleHit}
        >
          ¡GOLPEA!
        </button>
      </div>

      {isFinished && (
        <div className={styles.results}>
          <h3>¡Juego Terminado!</h3>
          <p>Puntuación final: {score}</p>
          <p>{score >= gameConfig.minScore ? '¡Victoria!' : 'Intenta de nuevo'}</p>
        </div>
      )}
    </div>
  );
};

export default FiveSpades;