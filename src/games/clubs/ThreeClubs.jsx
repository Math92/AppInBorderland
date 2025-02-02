// ThreeClubs.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import PlayingCard from '../../components/Card/PlayingCard';
import TeamManager from './TeamManager';
import { CLUB_GAMES } from '../types';
import styles from './ThreeClubs.module.css';

const gameConfig = CLUB_GAMES.THREE;

const ThreeClubs = () => {
  const { updateResults } = useGame();
  const [targetNumber, setTargetNumber] = useState(null);
  const [currentSum, setCurrentSum] = useState(0);
  const [rolls, setRolls] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);
  const [gameState, setGameState] = useState('PREPARING');
  const [currentTeam, setCurrentTeam] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const timeLeftRef = useRef(timeLeft);

  // Sincronizar ref con timeLeft
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Efecto para actualizar resultados al finalizar
  useEffect(() => {
    if (gameState === 'FINISHED' && gameResult) {
      updateResults({
        score: gameResult.score,
        success: gameResult.success
      });
    }
  }, [gameState, gameResult, updateResults]);

  // Inicializar juego
  const handleTeamFormed = useCallback((team) => {
    setCurrentTeam(team);
    setGameState('PLAYING');
    const target = Math.floor(
      Math.random() * (gameConfig.targetRange.max - gameConfig.targetRange.min + 1)
    ) + gameConfig.targetRange.min;
    setTargetNumber(target);
  }, []);

  // Verificar fin del juego (sin dependencia de timeLeft)
  const checkGameEnd = useCallback((sum) => {
    if (sum === targetNumber) return { shouldEnd: true, success: true };
    if (sum > targetNumber) return { shouldEnd: true, success: false };
    return { shouldEnd: false };
  }, [targetNumber]);

  // Lógica de tirada optimizada
  const handleRoll = useCallback(async () => {
    if (!currentTeam) return false;

    const roll = Math.floor(Math.random() * 6) + 1;
    const player = currentTeam[currentTurn];
    setCurrentRoll(roll);

    await new Promise(resolve => setTimeout(resolve, gameConfig.turnDelay));

    let gameEnded = false;
    setCurrentSum(prevSum => {
      const newSum = prevSum + roll;
      const result = checkGameEnd(newSum);
      
      if (result.shouldEnd) {
        gameEnded = true;
        const score = result.success 
          ? gameConfig.baseScore + (timeLeftRef.current * 10) 
          : 0;
        setGameResult({ success: result.success, score });
        setGameState('FINISHED');
      }
      return newSum;
    });

    setRolls(prev => [...prev, { player, value: roll }]);
    return gameEnded;
  }, [currentTeam, currentTurn, checkGameEnd, gameConfig.turnDelay]);

  // Manejar tirada del jugador
  const rollDice = useCallback(async () => {
    if (isRolling || !currentTeam || gameState !== 'PLAYING') return;

    setIsRolling(true);
    const gameEnded = await handleRoll();
    if (!gameEnded) {
      setCurrentTurn(prev => (prev + 1) % currentTeam.length);
    }
    setIsRolling(false);
  }, [currentTeam, gameState, handleRoll, isRolling]);

  // Temporizador del juego
  useEffect(() => {
    let timer;
    if (gameState === 'PLAYING' && timeLeft > 0 && !isRolling) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameResult({ success: false, score: 0 });
            setGameState('FINISHED');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => timer && clearInterval(timer);
  }, [gameState, timeLeft, isRolling]);

  // Manejar turnos de NPCs optimizado
useEffect(() => {
  let npcTimer;
  if (currentTeam && currentTurn !== 0 && gameState === 'PLAYING' && !isRolling) {
    const playNPCTurn = async () => {
      setIsRolling(true);
      const gameEnded = await handleRoll();
      if (!gameEnded) {
        setCurrentTurn(prev => (prev + 1) % currentTeam.length);
      }
      setIsRolling(false);
    };

    npcTimer = setTimeout(playNPCTurn, gameConfig.turnDelay);
  }
  return () => npcTimer && clearTimeout(npcTimer);
}, [currentTeam, currentTurn, gameState, isRolling, handleRoll, gameConfig.turnDelay]);

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
              <div className={styles.target}>Número Objetivo: {targetNumber}</div>
              <div className={styles.sum}>Suma actual: {currentSum}</div>
              <div className={styles.time}>Tiempo restante: {timeLeft}s</div>
            </div>

            <div className={styles.teamArea}>
              {team.map((player, index) => (
                <div key={player.id} 
                     className={`${styles.player} ${currentTurn === index ? styles.active : ''}`}>
                  <img src={player.avatar} alt={player.name} className={styles.avatar} />
                  <div className={styles.playerName}>{player.name}</div>
                  {currentTurn === index && (
                    <div className={styles.turn}>
                      {index === 0 ? '¡TU TURNO!' : 'TURNO DEL COMPAÑERO'}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isRolling && (
              <div className={styles.rollAnimation}>
                {currentTeam[currentTurn].name} está tirando...
                <div className={styles.dice}>🎲 {currentRoll}</div>
              </div>
            )}

            <div className={styles.rolls}>
              <h3 className={styles.rollsTitle}>Jugadas:</h3>
              {rolls.map((roll, index) => (
                <div key={index} className={styles.roll}>
                  <span className={styles.rollPlayer}>{roll.player.name}</span>
                  <span className={styles.rollValue}>{roll.value}</span>
                </div>
              ))}
            </div>

            {currentTurn === 0 && !isRolling && gameState === 'PLAYING' && (
              <button onClick={rollDice} className={styles.rollButton}>
                Tirar Dado
              </button>
            )}

            {gameState === 'FINISHED' && (
              <div className={styles.results}>
                <h3>¡Juego Terminado!</h3>
                <p>Objetivo: {targetNumber}</p>
                <p>Suma final: {currentSum}</p>
                {gameResult?.success ? (
                  <div className={styles.success}>¡Victoria en equipo!</div>
                ) : (
                  <div className={styles.failure}>
                    {currentSum > targetNumber ? 
                      '¡Se pasaron del objetivo!' : 
                      'No alcanzaron el objetivo a tiempo'}
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

export default ThreeClubs;