// ThreeHearts.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import styles from './ThreeHearts.module.css';
import PlayingCard from '../../components/Card/PlayingCard';
import imgHearts1 from '/public/images/3-hearts-1.jpg';
import imgHearts2 from '/public/images/3-hearts-2.jpg';

const gameConfig = {
  id: '3-hearts',
  name: 'Leer Emociones',
  minScore: 60,
  maxTime: 30
};

const scenarios = [
  {
    imagen: imgHearts2,
    emocionReal: "tristeza",
    contexto: "Un estudiante después de recibir sus calificaciones sonríe ampliamente.",
    opciones: [
      {
        emocion: "felicidad",
        esReal: false,
        explicacion: "La sonrisa no alcanza los ojos y los hombros están caídos."
      },
      {
        emocion: "tristeza",
        esReal: true,
        explicacion: "A pesar de la sonrisa, el lenguaje corporal muestra tristeza."
      },
      {
        emocion: "indiferencia",
        esReal: false,
        explicacion: "Hay demasiada tensión en la expresión para ser indiferencia."
      }
    ],
    tiempo: 20
  },
  {
    imagen: imgHearts1,
    emocionReal: "ira",
    contexto: "Un colega ríe durante una discusión acalorada en una reunión.",
    opciones: [
      {
        emocion: "diversión",
        esReal: false,
        explicacion: "La risa es forzada y hay tensión visible en la mandíbula."
      },
      {
        emocion: "nerviosismo",
        esReal: false,
        explicacion: "Los puños cerrados y la postura indican algo más intenso."
      },
      {
        emocion: "ira",
        esReal: true,
        explicacion: "La risa es una máscara para la ira, evidenciada por la postura rígida."
      }
    ],
    tiempo: 20
  }
];

const ThreeHearts = () => {
  const { updateResults } = useGame();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [timeLeft, setTimeLeft] = useState(scenarios[0].tiempo);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
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

    const isCorrect = opcion?.esReal || false;
    const puntosPorEscenario = 50;
    const nuevaPuntuacion = score + (isCorrect ? puntosPorEscenario : 0);
    setScore(nuevaPuntuacion);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setTimeLeft(scenarios[currentScenario + 1].tiempo);
        setSelectedOption(null);
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

  const renderScenario = () => (
    <div className={styles.scenarioContainer}>
      <div className={styles.imageContainer}>
        <img 
          src={scenarios[currentScenario].imagen}
          alt="Escenario emocional"
          className={styles.scenarioImage}
        />
      </div>
      <div className={styles.context}>{scenarios[currentScenario].contexto}</div>
      <div className={styles.timer}>Tiempo restante: {timeLeft}s</div>
      
      <div className={styles.optionsGrid}>
        {scenarios[currentScenario].opciones.map((opcion, index) => (
          <button
            key={index}
            onClick={() => handleSelection(opcion)}
            className={`${styles.option} ${
              gameState === 'FEEDBACK' && opcion.esReal ? styles.correct : ''
            } ${
              selectedOption === opcion && !opcion.esReal ? styles.incorrect : ''
            }`}
            disabled={gameState !== 'PLAYING'}
          >
            {opcion.emocion}
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
          <p className={styles.selectedEmotion}>
            Seleccionaste: {selectedOption.emocion}
          </p>
          <p className={`${styles.result} ${selectedOption.esReal ? styles.correct : styles.incorrect}`}>
            {selectedOption.esReal ? '¡Correcto!' : 'Incorrecto'}
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
        Puntuación Final: {score}/{scenarios.length * 50}
      </div>
      <div className={styles.feedback}>
        {score >= gameConfig.minScore
          ? "Has demostrado una excelente capacidad para leer emociones verdaderas."
          : "Necesitas practicar más para identificar emociones auténticas."}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <PlayingCard cardId={gameConfig.id} />
      <div className={styles.header}>
        ♥ {gameConfig.name} | Puntuación: {score}
      </div>

      {gameState === 'PLAYING' && renderScenario()}
      {gameState === 'FEEDBACK' && renderFeedback()}
      {gameState === 'FINISHED' && renderResults()}
    </div>
  );
};

export default ThreeHearts;