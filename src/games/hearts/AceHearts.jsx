// AceHearts.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { HEART_GAMES } from '../types';
import styles from './AceHearts.module.css';
import PlayingCard from '../../components/Card/PlayingCard';

const gameConfig = HEART_GAMES.ACE;

// Definición de escenarios para el As de Corazones
const scenarios = [
  {
    situacion: "En un juego de supervivencia, descubres que un jugador está ocultando comida mientras otros pasan hambre. Es padre de dos niños y guarda la comida para ellos.",
    contexto: "La comida es escasa y varios niños en el grupo también tienen hambre.",
    opciones: [
      { 
        texto: "Exponer públicamente al jugador para que comparta la comida",
        impacto: { grupo: 80, moral: -30, supervivencia: 60 },
        consecuencia: "El grupo obtiene comida pero la confianza se rompe. Los hijos del jugador pasan hambre."
      },
      { 
        texto: "Hablar en privado y proponer un sistema justo de racionamiento",
        impacto: { grupo: 60, moral: 70, supervivencia: 50 },
        consecuencia: "Se logra un compromiso, aunque algunos siguen recibiendo menos comida."
      },
      { 
        texto: "Mantener el secreto pero vigilar que no acumule más",
        impacto: { grupo: -20, moral: 40, supervivencia: 30 },
        consecuencia: "La desigualdad continúa pero evitas un conflicto inmediato."
      }
    ],
    tiempo: 20
  },
  {
    situacion: "Una jugadora herida te pide ayuda. Salvarla alertará a los enemigos de tu posición y pondrá en riesgo a tu grupo.",
    contexto: "Ella salvó a tu amigo en una ronda anterior, pero ahora tu grupo depende de mantenerse oculto.",
    opciones: [
      {
        texto: "Arriesgar todo para salvarla, honrando su acto previo",
        impacto: { lealtad: 90, riesgo: -70, karma: 80 },
        consecuencia: "Tu grupo queda expuesto pero ganas un aliado leal. Algunos miembros están resentidos."
      },
      {
        texto: "Darle recursos para que se ayude sola y partir",
        impacto: { lealtad: 30, riesgo: -20, karma: 40 },
        consecuencia: "Mantienes a tu grupo seguro pero cargas con la culpa. Su destino queda incierto."
      },
      {
        texto: "Ignorar sus súplicas y preservar la seguridad del grupo",
        impacto: { lealtad: -60, riesgo: 80, karma: -50 },
        consecuencia: "Tu grupo sobrevive pero pierdes respeto y confianza. Su muerte pesará en tu conciencia."
      }
    ],
    tiempo: 15
  }
];

const evaluateConsequences = (decisions) => {
  let consequences = {
    moral: 0,
    supervivencia: 0,
    lealtad: 0,
    karma: 0
  };
  
  let totalScore = 0;

  decisions.forEach(decision => {
    // Calculamos el score para cada decisión
    const impactValues = Object.values(decision.impacto);
    const baseScore = impactValues.reduce((sum, val) => sum + val, 0);
    const timeBonus = decision.timeLeft * 5;
    totalScore += baseScore + timeBonus;

    Object.entries(decision.impacto).forEach(([factor, valor]) => {
      if (consequences[factor] !== undefined) {
        consequences[factor] += valor;
      }
    });
  });

  return { consequences, totalScore };
};

const determineOutcome = (evaluationResult) => {
  const { consequences, totalScore } = evaluationResult;
  const total = Object.values(consequences).reduce((sum, val) => sum + val, 0);
  const average = total / Object.keys(consequences).length;

  return {
    score: totalScore,
    description: average > 50 
      ? "Tus decisiones priorizaron la humanidad sobre la supervivencia"
      : average > 0
      ? "Mantuviste un balance entre pragmatismo y empatía"
      : "Priorizaste la supervivencia sobre las conexiones humanas",
    consequences
  };
};

const AceHearts = () => {
  const { updateResults } = useGame();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [timeLeft, setTimeLeft] = useState(scenarios[0].tiempo);
  const [decisions, setDecisions] = useState([]);
  const [showing, setShowing] = useState('SITUATION');
  const [consequence, setConsequence] = useState(null);

  useEffect(() => {
    if (timeLeft > 0 && showing === 'SITUATION') {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, showing]);

  const handleDecision = (option) => {
    if (showing !== 'SITUATION') return;

    const decision = {
      ...option,
      timeLeft
    };

    setDecisions(prev => [...prev, decision]);
    setConsequence(option.consecuencia);
    setShowing('CONSEQUENCE');

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setTimeLeft(scenarios[currentScenario + 1].tiempo);
        setShowing('SITUATION');
      } else {
        const evaluationResult = evaluateConsequences(decisions);
        const outcome = determineOutcome(evaluationResult);
        updateResults({
          score: outcome.score,
          success: true // En este juego no hay éxito/fracaso tradicional
        });
        setShowing('FINISHED');
      }
    }, 3000);
  };

  const renderScenario = () => {
    const scenario = scenarios[currentScenario];
    return (
      <div className={styles.scenarioContainer}>
        <div className={styles.situation}>{scenario.situacion}</div>
        <div className={styles.context}>{scenario.contexto}</div>
        <div className={styles.timer}>Tiempo para decidir: {timeLeft}s</div>
        
        <div className={styles.optionsGrid}>
          {scenario.opciones.map((opcion, index) => (
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
  };

  const renderConsequence = () => (
    <div className={styles.consequenceContainer}>
      <h3>Consecuencia de tu decisión:</h3>
      <p>{consequence}</p>
    </div>
  );

  const renderResults = () => {
    const evaluationResult = evaluateConsequences(decisions);
    const outcome = determineOutcome(evaluationResult);
    
    return (
      <div className={styles.results}>
        <h3>Análisis de tus decisiones</h3>
        <p className={styles.outcomeDescription}>{outcome.description}</p>
        <div className={styles.stats}>
          <div>Moral: {outcome.consequences.moral}</div>
          <div>Supervivencia: {outcome.consequences.supervivencia}</div>
          <div>Lealtad: {outcome.consequences.lealtad}</div>
          <div>Karma: {outcome.consequences.karma}</div>
        </div>
        <div className={styles.finalScore}>
          Puntaje Total: {outcome.score}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <PlayingCard cardId={gameConfig.id} />
      <div className={styles.header}>
        ♥ {gameConfig.name} | Escenario {currentScenario + 1}/{scenarios.length}
      </div>

      {showing === 'SITUATION' && renderScenario()}
      {showing === 'CONSEQUENCE' && renderConsequence()}
      {showing === 'FINISHED' && renderResults()}
    </div>
  );
};

export default AceHearts;