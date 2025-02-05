// FourClubs.jsx
import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import PlayingCard from '../../components/Card/PlayingCard';
import TeamManager from './TeamManager';
import { CLUB_GAMES } from '../types';
import styles from './FourClubs.module.css';

const gameConfig = CLUB_GAMES.FOUR;

const generateSequence = () => {
  return Array(gameConfig.sequenceLength).fill()
    .map(() => gameConfig.patterns[Math.floor(Math.random() * gameConfig.patterns.length)]);
};

// Mejorada la lógica de movimientos del NPC
const npcMove = (correctPattern, difficulty = 0.7) => {
  const random = Math.random();
  if (random < difficulty) return correctPattern;
  const incorrectOptions = gameConfig.patterns.filter(p => p !== correctPattern);
  return incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
};

// Nueva función para evaluar la sincronización
const evaluateSynchronization = (sequence, playerMoves, npcMoves) => {
  let synchronizedMoves = 0;
  let correctMoves = 0;

  for (let i = 0; i < sequence.length; i++) {
    if (playerMoves[i] === sequence[i]) correctMoves++;
    if (playerMoves[i] === npcMoves[i]) synchronizedMoves++;
  }

  const syncPercentage = (synchronizedMoves / sequence.length) * 100;
  const accuracyPercentage = (correctMoves / sequence.length) * 100;

  return {
    synchronizedMoves,
    correctMoves,
    syncPercentage,
    accuracyPercentage,
    isSuccess: syncPercentage >= 75 && accuracyPercentage >= 75
  };
};

const FourClubs = () => {
  const { updateResults } = useGame();
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [npcSequence, setNpcSequence] = useState([]);
  const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);
  const [gameState, setGameState] = useState('PREPARING');
  const [score, setScore] = useState(0);
  const [showingPattern, setShowingPattern] = useState(true);
  const [evaluation, setEvaluation] = useState(null);

  const handleTeamFormed = useCallback(() => {
    setGameState('PLAYING');
    setSequence(generateSequence());
  }, []);

  // Timer mejorado
  useEffect(() => {
    let timer;
    if (timeLeft > 0 && gameState === 'PLAYING' && !showingPattern) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('FINISHED');
            const timeoutEvaluation = evaluateSynchronization(sequence, playerSequence, npcSequence);
            finishGame(timeoutEvaluation);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => timer && clearInterval(timer);
  }, [timeLeft, gameState, showingPattern, sequence, playerSequence, npcSequence]);

  // Efecto del patrón inicial
  useEffect(() => {
    if (showingPattern) {
      const timer = setTimeout(() => {
        setShowingPattern(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showingPattern]);

  const finishGame = useCallback((evaluation) => {
    const timeBonus = Math.max(0, timeLeft * 2);
    const syncBonus = Math.floor(evaluation.syncPercentage * 0.5);
    const accuracyBonus = Math.floor(evaluation.accuracyPercentage * 0.5);
    
    const finalScore = evaluation.isSuccess
      ? gameConfig.baseScore + timeBonus + syncBonus + accuracyBonus
      : Math.floor((syncBonus + accuracyBonus) / 2);

    setScore(finalScore);
    setEvaluation(evaluation);
    setGameState('FINISHED');
    
    updateResults({
      score: finalScore,
      success: evaluation.isSuccess
    });
  }, [timeLeft, updateResults]);

  const makeNPCMove = useCallback(() => {
    const npcMoves = [];
    
    const executeMove = (index) => {
      if (index >= sequence.length) {
        const evaluation = evaluateSynchronization(sequence, playerSequence, npcMoves);
        finishGame(evaluation);
        return;
      }

      const currentCorrect = sequence[index];
      const npcDecision = npcMove(currentCorrect);
      
      npcMoves.push(npcDecision);
      setNpcSequence([...npcMoves]);

      setTimeout(() => executeMove(index + 1), gameConfig.turnDelay);
    };

    executeMove(0);
  }, [sequence, playerSequence, finishGame]);

  const handlePlayerMove = (direction) => {
    if (gameState !== 'PLAYING' || showingPattern) return;

    const newPlayerSequence = [...playerSequence, direction];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence.length === sequence.length) {
      setNpcSequence([]);
      makeNPCMove();
    }
  };

  return (
    <div className={styles.container}>
      <PlayingCard cardId={gameConfig.id} />
      <div className={styles.header}>
        ♣ {gameConfig.name}
      </div>

      <TeamManager teamSize={gameConfig.teamSize} onTeamFormed={handleTeamFormed}>
        {(team) => (
          <div className={styles.gameArea}>
            <div className={styles.gameInfo}>
              <div className={styles.score}>Puntuación: {score}</div>
              <div className={styles.timer}>Tiempo: {timeLeft}s</div>
              <div className={styles.instructions}>
                {showingPattern ? 'Memoriza el patrón...' : '¡Replica el patrón completo!'}
              </div>
            </div>

            {showingPattern ? (
              <div className={styles.patternDisplay}>
                {sequence.map((direction, index) => (
                  <div key={index} className={styles.patternArrow}>
                    {direction}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.teamDisplay}>
                {team.map((player, index) => (
                  <div key={player.id} className={styles.playerContainer}>
                    <img src={player.avatar} alt={player.name} className={styles.avatar} />
                    <div className={styles.playerName}>
                      {player.name} {index === 0 && '(Tú)'}
                    </div>
                    <div className={styles.sequenceDisplay}>
                      {(index === 0 ? playerSequence : npcSequence).map((dir, i) => (
                        <div key={i} className={styles.arrow}>{dir}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!showingPattern && gameState === 'PLAYING' && (
              <div className={styles.controls}>
                {gameConfig.patterns.map((direction) => (
                  <button
                    key={direction}
                    onClick={() => handlePlayerMove(direction)}
                    className={styles.controlButton}
                    disabled={showingPattern || playerSequence.length === sequence.length}
                  >
                    {direction}
                  </button>
                ))}
              </div>
            )}

            {gameState === 'FINISHED' && evaluation && (
              <div className={styles.results}>
                <h3>Juego Completado</h3>
                <div className={styles.evaluationDetails}>
                  <p>Sincronización: {Math.round(evaluation.syncPercentage)}%</p>
                  <p>Precisión: {Math.round(evaluation.accuracyPercentage)}%</p>
                  <p>Movimientos sincronizados: {evaluation.synchronizedMoves}/{sequence.length}</p>
                  <p>Movimientos correctos: {evaluation.correctMoves}/{sequence.length}</p>
                </div>
                <p className={styles.finalScore}>Puntuación Final: {score}</p>
                {evaluation.isSuccess ? (
                  <div className={styles.success}>¡Sincronización Perfecta!</div>
                ) : (
                  <div className={styles.failure}>
                    {evaluation.syncPercentage >= 75 
                      ? "¡Buena sincronización, pero hay que mejorar la precisión!"
                      : "Necesitan mejorar su coordinación"}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </TeamManager>
    </div>
  );
};

export default FourClubs;