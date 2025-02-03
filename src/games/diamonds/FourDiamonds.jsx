// FourDiamonds.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { DIAMOND_GAMES } from '../types';
import styles from './FourDiamonds.module.css';
import PlayingCard from '../../components/Card/PlayingCard';

const gameConfig = DIAMOND_GAMES.FOUR;

const generateSequence = () => {
  const sequence = new Set();
  
  // Generar números aleatorios únicos hasta tener sequenceLength números
  while(sequence.size < gameConfig.sequenceLength) {
    const number = Math.floor(Math.random() * 50) + 1;
    sequence.add(number);
  }
  
  return Array.from(sequence);
};

const FourDiamonds = () => {
  const { updateResults } = useGame();
  const [sequence, setSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [gamePhase, setGamePhase] = useState('MEMORIZE'); // MEMORIZE, INPUT, FINISHED
  const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);
  const [score, setScore] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  // Inicializar juego
  useEffect(() => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    
    // Cambiar a fase de input después del tiempo de visualización
    const displayTimer = setTimeout(() => {
      setGamePhase('INPUT');
    }, gameConfig.displayTime * 1000);

    return () => clearTimeout(displayTimer);
  }, []);

  // Timer principal
  useEffect(() => {
    if (gamePhase === 'INPUT' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGamePhase('FINISHED');
            updateResults({
              score: 0,
              success: false
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gamePhase, timeLeft, updateResults]);

  const handleNumberClick = (number) => {
    if (gamePhase !== 'INPUT') return;

    const newInput = [...playerInput, number];
    setPlayerInput(newInput);

    // Verificar si la secuencia está completa
    if (newInput.length === sequence.length) {
      const reversedSequence = [...sequence].reverse();
      const isInputCorrect = newInput.every((num, index) => num === reversedSequence[index]);
      setIsCorrect(isInputCorrect);

      if (isInputCorrect) {
        const timeBonus = timeLeft >= gameConfig.timeBonus.threshold ? 
          gameConfig.timeBonus.points : 0;
        const finalScore = gameConfig.baseScore + timeBonus;
        setScore(finalScore);
        setExplanation('¡Secuencia invertida correctamente!');
      } else {
        setExplanation('La secuencia no coincide con el orden inverso correcto.');
      }

      setGamePhase('FINISHED');
      updateResults({
        score: isInputCorrect ? score : 0,
        success: isInputCorrect
      });
    }
  };

  const renderMemorizePhase = () => (
    <div className={styles.memorizePhase}>
      <h3>¡Memoriza la secuencia!</h3>
      <p>Tiempo para memorizar: {gameConfig.displayTime}s</p>
      <div className={styles.sequence}>
        {sequence.map((number, index) => (
          <div key={index} className={styles.number}>
            {number}
          </div>
        ))}
      </div>
      <p className={styles.instruction}>
        Deberás reproducir esta secuencia en orden inverso
      </p>
    </div>
  );

  const renderInputPhase = () => (
    <div className={styles.inputPhase}>
      <div className={styles.timer}>Tiempo: {timeLeft}s</div>
      <div className={styles.currentInput}>
        {playerInput.map((number, index) => (
          <div key={index} className={styles.inputNumber}>
            {number}
          </div>
        ))}
      </div>
      <div className={styles.numberGrid}>
        {sequence.map(number => (
          <button
            key={number}
            onClick={() => handleNumberClick(number)}
            className={styles.numberButton}
            disabled={playerInput.includes(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className={styles.results}>
      <h3>Resultados</h3>
      <div className={isCorrect ? styles.success : styles.failure}>
        {explanation}
      </div>
      {isCorrect && (
        <div className={styles.scoreBreakdown}>
          <p>Puntuación base: {gameConfig.baseScore}</p>
          {timeLeft >= gameConfig.timeBonus.threshold && (
            <p>Bonus por tiempo: +{gameConfig.timeBonus.points}</p>
          )}
          <p className={styles.totalScore}>Total: {score}</p>
        </div>
      )}
      <div className={styles.comparison}>
        <div>
          <h4>Secuencia original:</h4>
          <div className={styles.sequenceDisplay}>
            {sequence.join(' → ')}
          </div>
        </div>
        <div>
          <h4>Tu respuesta:</h4>
          <div className={styles.sequenceDisplay}>
            {playerInput.join(' → ')}
          </div>
        </div>
        <div>
          <h4>Secuencia correcta:</h4>
          <div className={styles.sequenceDisplay}>
            {[...sequence].reverse().join(' → ')}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <PlayingCard cardId="4-diamonds" />
      <div className={styles.header}>
        ♦ {gameConfig.name}
      </div>

      <div className={styles.gameArea}>
        {gamePhase === 'MEMORIZE' && renderMemorizePhase()}
        {gamePhase === 'INPUT' && renderInputPhase()}
        {gamePhase === 'FINISHED' && renderResults()}
      </div>
    </div>
  );
};

export default FourDiamonds;