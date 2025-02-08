// FiveHearts.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { HEART_GAMES } from '../types';
import styles from './FiveHearts.module.css';
import PlayingCard from '../../components/Card/PlayingCard';

const gameConfig = HEART_GAMES.FIVE;

const GROUP_MEMBERS = [
  { id: 1, name: 'Ana', baseStability: 0.8 },
  { id: 2, name: 'Carlos', baseStability: 0.6 },
  { id: 3, name: 'Elena', baseStability: 0.7 },
  { id: 4, name: 'David', baseStability: 0.5 },
  { id: 5, name: 'María', baseStability: 0.9 }
];

const EMOTIONAL_EVENTS = [
  {
    type: 'CONFLICT',
    description: 'Conflicto entre miembros',
    impact: -20,
    duration: 5000,
    responses: [
      { text: 'Mediar la situación', impact: 15, stability: 0.8 },
      { text: 'Dar espacio', impact: 5, stability: 0.6 },
      { text: 'Tomar partido', impact: -10, stability: 0.3 }
    ]
  },
  {
    type: 'SUCCESS',
    description: 'Logro del equipo',
    impact: 15,
    duration: 4000,
    responses: [
      { text: 'Celebrar en equipo', impact: 10, stability: 0.9 },
      { text: 'Reconocer individualmente', impact: 5, stability: 0.7 },
      { text: 'Seguir trabajando', impact: -5, stability: 0.5 }
    ]
  },
  {
    type: 'PRESSURE',
    description: 'Fecha límite cercana',
    impact: -15,
    duration: 6000,
    responses: [
      { text: 'Organizar y delegar', impact: 12, stability: 0.8 },
      { text: 'Aumentar el ritmo', impact: -8, stability: 0.4 },
      { text: 'Pedir extensión', impact: 5, stability: 0.6 }
    ]
  },
  {
    type: 'PERSONAL',
    description: 'Problema personal de un miembro',
    impact: -25,
    duration: 5500,
    responses: [
      { text: 'Ofrecer apoyo grupal', impact: 20, stability: 0.9 },
      { text: 'Dar día libre', impact: 10, stability: 0.7 },
      { text: 'Mantener profesionalidad', impact: -5, stability: 0.4 }
    ]
  },
  {
    type: 'CHANGE',
    description: 'Cambio en el proyecto',
    impact: -18,
    duration: 5000,
    responses: [
      { text: 'Adaptar estrategia', impact: 15, stability: 0.8 },
      { text: 'Mantener rumbo', impact: -10, stability: 0.3 },
      { text: 'Consultar al equipo', impact: 8, stability: 0.7 }
    ]
  }
];

const FiveHearts = () => {
  const { updateResults } = useGame();
  const [gameState, setGameState] = useState('PLAYING');
  const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);
  const [score, setScore] = useState(0);
  const [groupMood, setGroupMood] = useState(0);
  const [activeEvents, setActiveEvents] = useState([]);
  const [stabilityLevel, setStabilityLevel] = useState(1);
  const [eventHistory, setEventHistory] = useState([]);
  const [unusedEvents, setUnusedEvents] = useState([...EMOTIONAL_EVENTS]);
  const [availableMembers, setAvailableMembers] = useState([...GROUP_MEMBERS]);
  const [hasShownWarning, setHasShownWarning] = useState(false);

  const finishGameRef = useRef(null);

  useEffect(() => {
    const endGame = () => {
      const finalScore = score;
      const isMoodStable = Math.abs(groupMood) < gameConfig.moodRange.criticalThreshold;
      setGameState('FINISHED');
      // Usar setTimeout para evitar el warning de setState durante el render
      setTimeout(() => {
        updateResults({
          score: finalScore,
          success: finalScore >= gameConfig.minScore && isMoodStable
        });
      }, 0);
    };
  
    finishGameRef.current = endGame;
  }, [score, groupMood, gameConfig.minScore, gameConfig.moodRange.criticalThreshold, updateResults]);

  const generateEvent = useCallback(() => {
    if (unusedEvents.length === 0) {
      if (!hasShownWarning) {
        setScore(prev => Math.max(0, prev - 20));
        setHasShownWarning(true);
      }
      setUnusedEvents([...EMOTIONAL_EVENTS]);
      setAvailableMembers([...GROUP_MEMBERS]);
      return null; // Retornamos null si no hay eventos disponibles
    }
  
    if (availableMembers.length === 0) {
      setAvailableMembers([...GROUP_MEMBERS]);
      return null; // Retornamos null si no hay miembros disponibles
    }
  
    const eventIndex = Math.floor(Math.random() * unusedEvents.length);
    const memberIndex = Math.floor(Math.random() * availableMembers.length);
  
    const selectedEvent = unusedEvents[eventIndex];
    const selectedMember = availableMembers[memberIndex];
  
    if (!selectedEvent || !selectedMember) {
      return null; // Verificación adicional de seguridad
    }
  
    setUnusedEvents(prev => prev.filter((_, index) => index !== eventIndex));
    setAvailableMembers(prev => prev.filter((_, index) => index !== memberIndex));
  
    return {
      ...selectedEvent,
      id: Date.now(),
      member: selectedMember,
      timeStamp: Date.now(),
      handled: false
    };
  }, [unusedEvents, availableMembers, hasShownWarning])

  const handleResponse = useCallback((event, response) => {
    if (gameState !== 'PLAYING') return;

    const impactMultiplier = stabilityLevel;
    const totalImpact = response.impact * impactMultiplier;

    setGroupMood(prev => {
      const newMood = Math.max(
        gameConfig.moodRange.min,
        Math.min(gameConfig.moodRange.max, prev + totalImpact)
      );
      return newMood;
    });

    setStabilityLevel(prev => prev * response.stability);
    setActiveEvents(prev => prev.filter(e => e.id !== event.id));
    
    setEventHistory(prev => [...prev, {
      event,
      response,
      impact: totalImpact,
      timestamp: Date.now()
    }]);

    if (Math.abs(groupMood) < gameConfig.moodRange.warningThreshold) {
      setScore(prev => prev + gameConfig.stabilityBonus);
    }
  }, [gameState, stabilityLevel, groupMood]);


  useEffect(() => {
    if (gameState !== 'PLAYING') return;
  
    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('FINISHED');
          if (finishGameRef.current) {
            finishGameRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  

    const eventTimer = setInterval(() => {
        if (activeEvents.length < gameConfig.maxSimultaneousEvents) {
          const newEvent = generateEvent();
          if (newEvent) { // Solo añadimos el evento si es válido
            setActiveEvents(prev => [...prev, newEvent]);
          }
        }
      }, gameConfig.eventFrequency);
    
      const penaltyTimer = setInterval(() => {
        if (Math.abs(groupMood) > gameConfig.moodRange.warningThreshold) {
          setScore(prev => Math.max(0, prev - gameConfig.penaltyRate));
        }
      }, 1000);
    
      return () => {
        clearInterval(gameTimer);
        clearInterval(eventTimer);
        clearInterval(penaltyTimer);
      };
    }, [gameState, generateEvent, activeEvents.length, groupMood]);

    const renderMoodMeter = () => (
        <div className={styles.moodMeter}>
          <div className={styles.moodBar}>
            {/* Líneas de advertencia y críticas */}
            <div className={`${styles.warningBar} ${styles.left}`} 
                 style={{ left: `${gameConfig.moodRange.warningThreshold}%` }} />
            <div className={`${styles.warningBar} ${styles.right}`} 
                 style={{ right: `${gameConfig.moodRange.warningThreshold}%` }} />
            <div className={`${styles.criticalBar} ${styles.left}`} 
                 style={{ left: `${gameConfig.moodRange.criticalThreshold}%` }} />
            <div className={`${styles.criticalBar} ${styles.right}`} 
                 style={{ right: `${gameConfig.moodRange.criticalThreshold}%` }} />
            
            {/* Barra de estado de ánimo */}
            <div 
              className={styles.moodLevel}
              style={{ 
                width: `${Math.abs(groupMood)}%`,
                backgroundColor: getMoodColor(groupMood),
                marginLeft: groupMood < 0 ? `${50 - Math.abs(groupMood)/2}%` : '50%',
                marginRight: groupMood > 0 ? `${50 - Math.abs(groupMood)/2}%` : '50%'
              }}
            />
          </div>
          <div className={styles.moodLabels}>
            <span>Tensión</span>
            <span className={styles.moodValue}>{Math.abs(groupMood)}%</span>
            <span>Euforia</span>
          </div>
          {/* Indicador de estado */}
          <div className={styles.moodStatus}>
            Estado: {
              Math.abs(groupMood) >= gameConfig.moodRange.criticalThreshold ? 
                <span className={styles.critical}>Crítico</span> :
              Math.abs(groupMood) >= gameConfig.moodRange.warningThreshold ?
                <span className={styles.warning}>Inestable</span> :
                <span className={styles.stable}>Equilibrado</span>
            }
          </div>
        </div>
      );
  const getMoodColor = useCallback((moodValue) => {
    const absValue = Math.abs(moodValue);
    if (absValue >= gameConfig.moodRange.criticalThreshold) {
      return moodValue > 0 ? '#ef4444' : '#dc2626'; // Rojo crítico
    }
    if (absValue >= gameConfig.moodRange.warningThreshold) {
      return moodValue > 0 ? '#f59e0b' : '#d97706'; // Naranja advertencia
    }
    return moodValue > 0 ? '#34d399' : '#10b981'; // Verde normal
  }, [gameConfig.moodRange]);

  const renderActiveEvents = () => (
    <div className={styles.eventsContainer}>
      {activeEvents.map(event => {
        // Verificación de seguridad para el evento y su miembro
        if (!event || !event.member) return null;
  
        return (
          <div key={event.id} className={styles.eventCard}>
            <div className={styles.eventHeader}>
              <span className={styles.eventType}>{event.type}</span>
              <span className={styles.eventMember}>{event.member.name}</span>
            </div>
            <p className={styles.eventDescription}>{event.description}</p>
            <div className={styles.responseOptions}>
              {event.responses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(event, response)}
                  className={styles.responseButton}
                >
                  {response.text}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderResults = () => (
    <div className={styles.results}>
      <h2>Sesión Finalizada</h2>
      <div className={styles.finalScore}>
        Puntuación: {score}
      </div>
      <div className={styles.finalMood}>
        Estado final del grupo: {
          Math.abs(groupMood) < gameConfig.moodRange.warningThreshold
            ? 'Equilibrado'
            : Math.abs(groupMood) < gameConfig.moodRange.criticalThreshold
              ? 'Inestable'
              : 'Crítico'
        }
      </div>
      <div className={styles.eventsSummary}>
        <h3>Resumen de eventos</h3>
        <ul>
          {eventHistory.map((entry, index) => (
            <li key={index} className={styles.eventSummary}>
              <span>{entry.event.type}</span>
              <span>{entry.response.text}</span>
              <span className={entry.impact > 0 ? styles.positive : styles.negative}>
                {entry.impact > 0 ? '+' : ''}{entry.impact}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <PlayingCard cardId={gameConfig.id} />
      <div className={styles.header}>
        ♥ {gameConfig.name} | Puntuación: {score} | Tiempo: {timeLeft}s
        {hasShownWarning && (
          <span className={styles.eventWarning}>
            ¡Atención! Eventos reiniciados (-20 puntos)
          </span>
        )}
      </div>

      <div className={styles.gameArea}>
        {gameState === 'PLAYING' && (
          <>
            {renderMoodMeter()}
            {renderActiveEvents()}
          </>
        )}
        {gameState === 'FINISHED' && renderResults()}
      </div>
    </div>
  );
};



export default FiveHearts;