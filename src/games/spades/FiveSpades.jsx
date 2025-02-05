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
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [beats, setBeats] = useState([]);
  const [isStarting, setIsStarting] = useState(true);
  const [countdown, setCountdown] = useState(3);
  
  const beatIdRef = useRef(0);
  const scoreRef = useRef({ perfect: 0, good: 0, miss: 0, total: 0 });
  const animationFrameRef = useRef();
  const intervalsRef = useRef([]);

  useEffect(() => {
    if (timeLeft <= 0 && !isFinished) {
      const success = score >= gameConfig.minScore; // Ahora compara con 450
      updateResults({
        score: Math.round(score),
        success: success
      });
      setIsFinished(true);
    }
  }, [timeLeft, isFinished, score, updateResults]);

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
    
    // Generador de beats
    const beatInterval = setInterval(() => {
      const newBeat = {
        id: beatIdRef.current++,
        timing: Date.now(),
        hit: false
      };
      setBeats(prev => [...prev, newBeat]);
    }, gameConfig.beatSpeed);

    // Animación
    const animate = () => {
      if (!isFinished) {
        setBeats(currentBeats => 
          currentBeats.map(beat => ({
            ...beat,
            position: ((Date.now() - beat.timing) / gameConfig.beatSpeed) * 100
          })).filter(beat => beat.position < 100)
        );
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

  const handleHit = () => {
    if (isFinished || isStarting) return;
    
    const now = Date.now();
    const targetBeat = beats.find(beat => {
      const expectedHitTime = beat.timing + gameConfig.beatSpeed;
      return !beat.hit && Math.abs(now - expectedHitTime) <= gameConfig.tolerance;
    });

    if (targetBeat) {
      const timeDiff = Math.abs(now - (targetBeat.timing + gameConfig.beatSpeed));
      let points = 0;
      
      if (timeDiff <= 75) { // 150ms de tolerance dividido en 2 rangos
        setFeedback('¡PERFECTO! 🎯');
        points = 100;
        scoreRef.current.perfect++;
        setCombo(c => c + 1);
      } else {
        setFeedback('¡BIEN! ✨');
        points = 50;
        scoreRef.current.good++;
        setCombo(c => c + 1);
      }

      setBeats(prev => prev.map(b => 
        b.id === targetBeat.id ? { ...b, hit: true } : b
      ));
      
      scoreRef.current.total++;
      // En handleHit, modificar el cálculo de puntos
setScore(prev => prev + points * (combo >= 3 ? 2 : 1)); // Multiplicador más accesible
      
      // Reset feedback después de 800ms
      setTimeout(() => setFeedback(''), 800);
    } else {
      setFeedback('¡FALLASTE! 💨');
      scoreRef.current.miss++;
      setCombo(0);
      setTimeout(() => setFeedback(''), 800);
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
            <p>¡Mantén el combo para multiplicar tu puntuación!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PlayingCard cardId="5-spades" />
      <div className={styles.header}>
        Tiempo: {timeLeft}s | Puntos: {score} | Combo: {combo}x
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
          <h3>Resultados</h3>
          <div className={styles.stats}>
            <p>Perfectos: {scoreRef.current.perfect}</p>
            <p>Buenos: {scoreRef.current.good}</p>
            <p>Fallos: {scoreRef.current.miss}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiveSpades;