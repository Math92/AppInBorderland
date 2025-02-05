import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { HEART_GAMES } from '../types.js';
import styles from './FourHearts.module.css';
import PlayingCard from '../../components/Card/PlayingCard';

const gameConfig = HEART_GAMES.FOUR;

const emotionalPatterns = [
    {
      sequence: ['😊', '😢', '😊', '❓'],
      context: "Alguien que alterna entre mostrar felicidad y tristeza puede estar...",
      correctAnswer: "Ocultando dolor emocional",
      options: [
        "Siendo manipulador",
        "Ocultando dolor emocional",
        "Teniendo un buen día",
        "Siendo indeciso"
      ],
      explanation: "Los cambios rápidos entre felicidad y tristeza a menudo indican dolor emocional subyacente"
    },
    {
      sequence: ['😠', '😨', '😅', '❓'],
      context: "Una persona que pasa de ira a miedo y luego risa nerviosa suele estar...",
      correctAnswer: "Sintiendo vulnerabilidad",
      options: [
        "Sintiendo vulnerabilidad",
        "Siendo agresivo",
        "Divirtiéndose",
        "Confundido"
      ],
      explanation: "Este patrón indica un mecanismo de defensa donde la risa enmascara vulnerabilidad"
    },
    {
      sequence: ['🤔', '😕', '😤', '❓'],
      context: "La progresión de pensativo a confuso y luego frustrado sugiere...",
      correctAnswer: "Sobrecarga cognitiva",
      options: [
        "Aburrimiento",
        "Sobrecarga cognitiva",
        "Desinterés",
        "Distracción"
      ],
      explanation: "Esta secuencia muestra el proceso de agotamiento mental bajo presión"
    }
  ];
  
  const FourHearts = () => {
    const { updateResults } = useGame();
    const [currentPattern, setCurrentPattern] = useState(0);
    const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [gameState, setGameState] = useState('PLAYING');
    const [showExplanation, setShowExplanation] = useState(false);
  
    useEffect(() => {
      if (timeLeft > 0 && gameState === 'PLAYING') {
        const timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else if (timeLeft <= 0 && gameState === 'PLAYING') {
        handleAnswer(null);
      }
    }, [timeLeft, gameState]);
  
    const handleAnswer = (answer) => {
      if (gameState !== 'PLAYING') return;
  
      setSelectedAnswer(answer);
      setShowExplanation(true);
      
      const isCorrect = answer === emotionalPatterns[currentPattern].correctAnswer;
      const pointsEarned = isCorrect ? 30 : 0;
      const timeBonus = Math.floor(timeLeft * 0.5);
      
      setScore(prev => prev + pointsEarned + timeBonus);
  
      setTimeout(() => {
        setShowExplanation(false);
        if (currentPattern < emotionalPatterns.length - 1) {
          setCurrentPattern(prev => prev + 1);
          setTimeLeft(gameConfig.maxTime);
          setSelectedAnswer(null);
        } else {
          setGameState('FINISHED');
          const finalScore = score + pointsEarned + timeBonus;
          updateResults({
            score: finalScore,
            success: finalScore >= gameConfig.minScore
          });
        }
      }, 3000);
    };
  
    const renderPattern = () => (
      <div className={styles.patternContainer}>
        <div className={styles.emojiSequence}>
          {emotionalPatterns[currentPattern].sequence.map((emoji, index) => (
            <div key={index} className={styles.emojiContainer}>
              {emoji}
            </div>
          ))}
        </div>
        <div className={styles.context}>
          {emotionalPatterns[currentPattern].context}
        </div>
        <div className={styles.timer}>
          Tiempo: {timeLeft}s
        </div>
        <div className={styles.optionsGrid}>
          {emotionalPatterns[currentPattern].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={styles.optionButton}
              disabled={showExplanation}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  
    const renderExplanation = () => (
      <div className={styles.explanationContainer}>
        <h3>Análisis del Patrón</h3>
        <p className={styles.selectedAnswer}>
          Tu respuesta: {selectedAnswer || "Tiempo agotado"}
        </p>
        <p className={`${styles.result} ${
          selectedAnswer === emotionalPatterns[currentPattern].correctAnswer 
            ? styles.correct 
            : styles.incorrect
        }`}>
          {selectedAnswer === emotionalPatterns[currentPattern].correctAnswer 
            ? '¡Correcto!' 
            : 'Incorrecto'}
        </p>
        <p className={styles.explanation}>
          {emotionalPatterns[currentPattern].explanation}
        </p>
      </div>
    );
  
    const renderResults = () => (
      <div className={styles.results}>
        <h3>Análisis de Patrones Completado</h3>
        <div className={styles.finalScore}>
          Puntuación Final: {score}
        </div>
        <div className={styles.feedback}>
          {score >= gameConfig.minScore
            ? "Has demostrado una comprensión avanzada de patrones emocionales complejos."
            : "Necesitas desarrollar más tu capacidad de reconocer patrones emocionales."}
        </div>
      </div>
    );
  
    return (
      <div className={styles.container}>
        <PlayingCard cardId={gameConfig.id} />
        <div className={styles.header}>
          ♥ {gameConfig.name} | Puntuación: {score}
        </div>
  
        {!showExplanation && gameState === 'PLAYING' && renderPattern()}
        {showExplanation && renderExplanation()}
        {gameState === 'FINISHED' && renderResults()}
      </div>
    );
  };
  
  export default FourHearts;