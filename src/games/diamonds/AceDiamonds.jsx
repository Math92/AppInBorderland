// AceDiamonds.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import styles from './AceDiamonds.module.css';
import PlayingCard from '../../components/Card/PlayingCard';

const gameConfig = {
  id: 'A-diamonds',
  name: 'Secuencias Lógicas',
  minScore: 60,
  maxTime: 30
};

const sequences = [
  {
    patron: "2, 4, 6, 8, ?",
    contexto: "Encuentra el siguiente número en la secuencia",
    opciones: [
      { valor: "9", esCorrecta: false, explicacion: "Esta secuencia aumenta de 2 en 2" },
      { valor: "10", esCorrecta: true, explicacion: "¡Correcto! La secuencia aumenta de 2 en 2" },
      { valor: "12", esCorrecta: false, explicacion: "La secuencia aumenta de 2 en 2" }
    ],
    tiempo: 15,
    pista: "Observa el patrón de incremento"
  },
  {
    patron: "3, 6, 12, 24, ?",
    contexto: "¿Cuál es el siguiente número?",
    opciones: [
      { valor: "30", esCorrecta: false, explicacion: "La secuencia se multiplica por 2" },
      { valor: "36", esCorrecta: false, explicacion: "La secuencia se multiplica por 2" },
      { valor: "48", esCorrecta: true, explicacion: "¡Correcto! Cada número se multiplica por 2" }
    ],
    tiempo: 15,
    pista: "Piensa en multiplicaciones"
  }
];

const AceDiamonds = () => {
  const { updateResults } = useGame();
  const [currentSequence, setCurrentSequence] = useState(0);
  const [timeLeft, setTimeLeft] = useState(sequences[0].tiempo);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPista, setShowPista] = useState(false);
  const [gameState, setGameState] = useState('PLAYING'); // PLAYING, FEEDBACK, FINISHED

  useEffect(() => {
    if (timeLeft > 0 && gameState === 'PLAYING') {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && gameState === 'PLAYING') {
      handleSelection(null);
    }
  }, [timeLeft, gameState]);

  const handleSelection = (opcion) => {
    if (gameState !== 'PLAYING') return;

    setSelectedOption(opcion);
    setGameState('FEEDBACK');

    const isCorrect = opcion?.esCorrecta || false;
    const puntosPorSecuencia = 50;
    const nuevaPuntuacion = score + (isCorrect ? puntosPorSecuencia : 0);
    setScore(nuevaPuntuacion);

    setTimeout(() => {
      if (currentSequence < sequences.length - 1) {
        setCurrentSequence(prev => prev + 1);
        setTimeLeft(sequences[currentSequence + 1].tiempo);
        setSelectedOption(null);
        setShowPista(false);
        setGameState('PLAYING');
      } else {
        setGameState('FINISHED');
        updateResults({
          score: nuevaPuntuacion,
          success: nuevaPuntuacion >= gameConfig.minScore
        });
      }
    }, 3000);
  };

  const renderSequence = () => (
    <div className={styles.sequenceContainer}>
      <div className={styles.pattern}>{sequences[currentSequence].patron}</div>
      <div className={styles.context}>{sequences[currentSequence].contexto}</div>
      <div className={styles.timer}>Tiempo: {timeLeft}s</div>
      
      <div className={styles.pistaContainer}>
        <button 
          onClick={() => setShowPista(true)} 
          className={styles.pistaButton}
          disabled={showPista}
        >
          {showPista ? "Pista mostrada" : "Mostrar pista"}
        </button>
        {showPista && (
          <div className={styles.pista}>{sequences[currentSequence].pista}</div>
        )}
      </div>

      <div className={styles.optionsGrid}>
        {sequences[currentSequence].opciones.map((opcion, index) => (
          <button
            key={index}
            onClick={() => handleSelection(opcion)}
            className={`${styles.option} ${
              gameState === 'FEEDBACK' && opcion.esCorrecta ? styles.correct : ''
            } ${
              selectedOption === opcion && !opcion.esCorrecta ? styles.incorrect : ''
            }`}
            disabled={gameState !== 'PLAYING'}
          >
            {opcion.valor}
          </button>
        ))}
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className={styles.feedbackContainer}>
      <h3>Análisis de la Respuesta</h3>
      {selectedOption ? (
        <>
          <p className={styles.selectedValue}>
            Tu respuesta: {selectedOption.valor}
          </p>
          <p className={`${styles.result} ${selectedOption.esCorrecta ? styles.correct : styles.incorrect}`}>
            {selectedOption.esCorrecta ? '¡Correcto!' : 'Incorrecto'}
          </p>
          <p className={styles.explanation}>{selectedOption.explicacion}</p>
        </>
      ) : (
        <p className={styles.timeOut}>¡Se acabó el tiempo!</p>
      )}
    </div>
  );

  const renderResults = () => (
    <div className={styles.results}>
      <h3>Prueba Completada</h3>
      <div className={styles.finalScore}>
        Puntuación Final: {score}/{sequences.length * 50}
      </div>
      <div className={styles.feedback}>
        {score >= gameConfig.minScore
          ? "¡Excelente razonamiento lógico!"
          : "Sigue practicando tus habilidades de deducción."}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <PlayingCard cardId="A-diamonds" />
      <div className={styles.header}>
        ♦ {gameConfig.name} | Puntuación: {score}
      </div>

      {gameState === 'PLAYING' && renderSequence()}
      {gameState === 'FEEDBACK' && renderFeedback()}
      {gameState === 'FINISHED' && renderResults()}
    </div>
  );
};

export default AceDiamonds;