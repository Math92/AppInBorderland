// TwoHearts.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { HEART_GAMES } from '../types';
import styles from './TwoHearts.module.css';
import PlayingCard from '../../components/Card/PlayingCard';

const gameConfig = HEART_GAMES.TWO;

const scenarios = [
  {
    situacion: "Tu compañero y tú han sido capturados. Te ofrecen libertad si lo traicionas. Él no sabe de esta oferta.",
    contexto: "Has pasado meses luchando juntos, compartiendo recursos y protegiéndose mutuamente.",
    opciones: [
      {
        texto: "Traicionar - Aceptar la oferta y dar información sobre tu compañero",
        impacto: { 
          traicion: 1, 
          confianza: -80, 
          supervivencia: 70 
        },
        consecuencia: {
          traiciona: "Ganas tu libertad, pero el peso de la traición te perseguirá.",
          esTraicionado: "Tu compañero te delató. Te enfrentas a consecuencias severas.",
          ambosTraicionan: "La desconfianza mutua lleva a que ambos sufran.",
          ambosConfian: "Tu lealtad fortalece el vínculo entre ambos."
        }
      },
      {
        texto: "Mantener Silencio - Permanecer leal a tu compañero",
        impacto: { 
          traicion: 0, 
          confianza: 90, 
          supervivencia: -30 
        },
        consecuencia: {
          traiciona: "Tu silencio te cuesta caro mientras tu compañero gana su libertad.",
          esTraicionado: "A pesar de tu lealtad, sufres las consecuencias de la traición.",
          ambosTraicionan: "La desconfianza mutua lleva a que ambos sufran.",
          ambosConfian: "La lealtad mutua fortalece vuestra alianza."
        }
      }
    ],
    tiempo: 30
  }
];

const TwoHearts = () => {
  const { updateResults } = useGame();
  const [timeLeft, setTimeLeft] = useState(scenarios[0].tiempo);
  const [currentDecision, setCurrentDecision] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [showing, setShowing] = useState('SITUATION');
  const [decisionCompañero, setDecisionCompañero] = useState(null);

  useEffect(() => {
    if (timeLeft > 0 && showing === 'SITUATION') {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && showing === 'SITUATION') {
      handleDecision(scenarios[0].opciones[1]);
    }
  }, [timeLeft, showing]);

  const simularDecisionCompañero = () => {
    return Math.random() > 0.3;
  };

  const evaluarResultado = (decisionJugador, decisionComp) => {
    if (!decisionJugador.impacto.traicion && decisionComp) {
      return {
        tipo: 'ambosConfian',
        score: 100,
        mensaje: decisionJugador.consecuencia.ambosConfian
      };
    } else if (decisionJugador.impacto.traicion && !decisionComp) {
      return {
        tipo: 'traiciona',
        score: 40,
        mensaje: decisionJugador.consecuencia.traiciona
      };
    } else if (!decisionJugador.impacto.traicion && !decisionComp) {
      return {
        tipo: 'esTraicionado',
        score: -20,
        mensaje: decisionJugador.consecuencia.esTraicionado
      };
    } else {
      return {
        tipo: 'ambosTraicionan',
        score: -50,
        mensaje: decisionJugador.consecuencia.ambosTraicionan
      };
    }
  };

  const handleDecision = (opcion) => {
    if (showing !== 'SITUATION') return;

    const compDecision = simularDecisionCompañero();
    setCurrentDecision(opcion);
    setDecisionCompañero(compDecision);

    const result = evaluarResultado(opcion, compDecision);
    setResultado(result);
    setShowing('CONSEQUENCE');

    setTimeout(() => {
      updateResults({
        score: result.score,
        success: result.score >= gameConfig.minScore
      });
      setShowing('FINISHED');
    }, 5000);
  };

  const renderSituation = () => (
    <div className={styles.scenarioContainer}>
      <div className={styles.situation}>{scenarios[0].situacion}</div>
      <div className={styles.context}>{scenarios[0].contexto}</div>
      <div className={styles.timer}>Tiempo para decidir: {timeLeft}s</div>
      
      <div className={styles.optionsGrid}>
        {scenarios[0].opciones.map((opcion, index) => (
          <button
            key={index}
            onClick={() => handleDecision(opcion)}
            className={styles.option}
            disabled={showing !== 'SITUATION'}
          >
            {opcion.texto}
          </button>
        ))}
      </div>
    </div>
  );

  const renderConsequence = () => (
    <div className={styles.consequenceContainer}>
      <h3>Resultado del Dilema</h3>
      <div className={styles.decisionInfo}>
        <p>Tu decisión: {currentDecision?.texto}</p>
        <p>Tu compañero decidió: {decisionCompañero ? 'Mantener Silencio' : 'Traicionar'}</p>
      </div>
      <p className={styles.outcome}>{resultado?.mensaje}</p>
      <div className={styles.score}>
        Puntuación: {resultado?.score}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className={styles.results}>
      <h3>Dilema Completado</h3>
      <div className={styles.finalDecisions}>
        <div className={styles.playerDecision}>
          <h4>Tu Decisión Final</h4>
          <p>{currentDecision?.texto}</p>
          <div className={styles.impactGrid}>
            <div className={styles.impactItem}>
              <span>Confianza: </span>
              <span className={currentDecision?.impacto.confianza >= 0 ? styles.positive : styles.negative}>
                {currentDecision?.impacto.confianza}
              </span>
            </div>
            <div className={styles.impactItem}>
              <span>Supervivencia: </span>
              <span className={currentDecision?.impacto.supervivencia >= 0 ? styles.positive : styles.negative}>
                {currentDecision?.impacto.supervivencia}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.finalScore} ${resultado?.score >= 0 ? styles.positive : styles.negative}`}>
        Puntuación Final: {resultado?.score}
      </div>
      <p className={styles.conclusionText}>
        {resultado?.score >= gameConfig.minScore 
          ? "Has demostrado un equilibrio entre lealtad y supervivencia."
          : "Tus decisiones revelan el verdadero costo de la traición."}
      </p>
    </div>
  );

  return (
    <div className={styles.container}>
      <PlayingCard cardId={gameConfig.id} />
      <div className={styles.header}>
        ♥ {gameConfig.name} | El Dilema de la Confianza
      </div>

      {showing === 'SITUATION' && renderSituation()}
      {showing === 'CONSEQUENCE' && renderConsequence()}
      {showing === 'FINISHED' && renderResults()}
    </div>
  );
};

export default TwoHearts;