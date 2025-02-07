import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { DIAMOND_GAMES } from '../types';
import styles from './FiveDiamonds.module.css';

const gameConfig = DIAMOND_GAMES.FIVE;

const FiveDiamonds = () => {
  const { updateResults } = useGame();
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);
  const [score, setScore] = useState(0);
  const [gamePhase, setGamePhase] = useState('START');
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentCards, setCurrentCards] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [lastOperator, setLastOperator] = useState(null);
  const [combo, setCombo] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const shuffleCards = () => {
    const numbers = Array.from({length: 9}, (_, i) => i + 2);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, gameConfig.cardsPerRound);
  };

  const generateCards = () => {
    const cardValues = shuffleCards();
    return cardValues.map(value => ({
      value,
      code: value === 10 ? '0D' : `${value}D`,
      url: `https://deckofcardsapi.com/static/img/${value === 10 ? '0' : value}D.png`,
      isSpecial: value === 5 || value === 10
    }));
  };

  const calculateResult = (cards, operator) => {
    const [a, b] = cards.map(card => card.value);
    let result = 0;
    switch (operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': 
        if (b === 0) return null;
        result = parseFloat((a / b).toFixed(1));
        break;
      default: return null;
    }
    
    if (operator === '-' && result < 0) return null;
    if (operator === '*' && result > 50) return null;
    if (operator === '/' && !Number.isInteger(result)) return null;
    
    return result;
  };

  const calculatePoints = (result, operator) => {
    if (result === null) return 0;

    let points = Math.abs(result);
    
    // Bonus por operador
    switch (operator) {
      case '+': points *= 1; break;
      case '-': points *= 1.5; break;
      case '*': points *= 0.5; break;
      case '/': points *= 2; break;
      default: break;
    }

    // Bonus por cartas especiales
    if (selectedCards.some(card => card.isSpecial)) {
      points *= 1.5;
    }

    // Bonus por combo
    if (operator === lastOperator) {
      points *= (1 + (combo * 0.2));
    }

    return Math.floor(points);
  };

  useEffect(() => {
    let timer;
    if (gamePhase === 'PLAYING' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGamePhase('FINISHED');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => timer && clearInterval(timer);
  }, [gamePhase, timeLeft]);

  const handleCardSelect = (card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(prev => prev.filter(c => c !== card));
      setSelectedOperator(null);
    } else if (selectedCards.length < 2) {
      setSelectedCards(prev => [...prev, card]);
    }
  };

  const handleOperatorSelect = (operator) => {
    if (selectedCards.length === 2) {
      setSelectedOperator(operator);
      const result = calculateResult(selectedCards, operator);
      setLastResult(result);
      setShowResult(true);
    }
  };

  const handleSubmit = () => {
    if (!lastResult) {
      setShowResult(false);
      return;
    }
   
    const roundPoints = calculatePoints(lastResult, selectedOperator);
    const finalScore = score + roundPoints;
   
    setScore(finalScore);
   
    if (selectedOperator === lastOperator) {
      setCombo(prev => prev + 1);
    } else {
      setCombo(0);
    }
    setLastOperator(selectedOperator);
   
    if (currentRound < gameConfig.roundsPerGame - 1) {
      setCurrentRound(prev => prev + 1);
      setCurrentCards(generateCards());
      setTimeLeft(gameConfig.maxTime);
      setSelectedCards([]);
      setSelectedOperator(null);
      setShowResult(false);
    } else {
      setGamePhase('FINISHED');
      updateResults({
        score: finalScore,
        success: finalScore >= gameConfig.minScore
      });
    }
   };

  const startGame = () => {
    setShowTutorial(false);
    setGamePhase('PLAYING');
    setCurrentCards(generateCards());
  };

  const resetGame = () => {
    setScore(0);
    setCurrentRound(0);
    setTimeLeft(gameConfig.maxTime);
    setGamePhase('START');
    setShowTutorial(true);
    setSelectedCards([]);
    setSelectedOperator(null);
    setCombo(0);
    setLastOperator(null);
    setShowResult(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        ♦ {gameConfig.name} | Ronda {currentRound + 1}/{gameConfig.roundsPerGame}
      </div>

      {showTutorial && (
        <div className={styles.tutorial}>
          <h3>¿Cómo jugar?</h3>
          <p>{gameConfig.description}</p>
          <ul className={styles.tutorialList}>
            <li>Selecciona 2 cartas (5♦ y 10♦ son especiales: ×1.5 puntos)</li>
            <li>Elige operación: +, -, × o ÷</li>
            <li>Suma = ×1 | Resta = ×1.5 | Multiplicación = ×0.5 | División = ×2</li>
            <li>¡Usar la misma operación aumenta el combo!</li>
            <li>Consigue {gameConfig.minScore} puntos para ganar</li>
          </ul>
          <button onClick={startGame} className={styles.startButton}>¡Comenzar!</button>
        </div>
      )}

      {gamePhase === 'PLAYING' && currentCards && (
        <div className={styles.gameArea}>
          <div className={styles.stats}>
            <div className={styles.time}>⏱️ {timeLeft}s</div>
            <div className={styles.score}>
              🎯 {score} puntos
              {combo > 0 && <span className={styles.combo}>🔥 ×{(1 + (combo * 0.2)).toFixed(1)}</span>}
            </div>
          </div>

          <div className={styles.cards}>
            {currentCards.map((card, index) => (
              <div
                key={index}
                onClick={() => handleCardSelect(card)}
                className={`${styles.card} ${
                  selectedCards.includes(card) ? styles.selected : ''
                } ${card.isSpecial ? styles.special : ''}`}
              >
                <img src={card.url} alt={`${card.value} of Diamonds`} />
                {card.isSpecial && <div className={styles.specialBadge}>★</div>}
              </div>
            ))}
          </div>

          {selectedCards.length === 2 && (
            <>
              <div className={styles.operators}>
                {['+', '-', '*', '/'].map((op) => (
                  <button
                    key={op}
                    onClick={() => handleOperatorSelect(op)}
                    className={`${styles.operator} ${
                      selectedOperator === op ? styles.selected : ''
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className={styles.resultPreview}>
                  {lastResult === null ? (
                    <span className={styles.invalid}>Operación Inválida</span>
                  ) : (
                    <>
                      <span>{selectedCards[0].value} {selectedOperator} {selectedCards[1].value} = {lastResult}</span>
                      <span className={styles.points}>
                        +{calculatePoints(lastResult, selectedOperator)} puntos
                      </span>
                    </>
                  )}
                </div>
              )}

              {selectedOperator && (
                <button 
                  onClick={handleSubmit} 
                  className={`${styles.submitButton} ${!lastResult ? styles.invalid : ''}`}
                  disabled={!lastResult}
                >
                  {lastResult ? 'Confirmar' : 'Inválido'}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {gamePhase === 'FINISHED' && (
        <div className={styles.results}>
          <h3>🎮 Juego Terminado</h3>
          <div className={styles.finalScore}>
            Puntuación Final: {score}
          </div>
          <div className={styles.result}>
            {score >= gameConfig.minScore ? 
              gameConfig.feedback.win : 
              gameConfig.feedback.lose}
          </div>
          <button onClick={resetGame} className={styles.startButton}>
            Jugar de Nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default FiveDiamonds;