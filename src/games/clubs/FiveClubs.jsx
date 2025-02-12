// FiveClubs.jsx
import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import PlayingCard from '../../components/Card/PlayingCard';
import TeamManager from './TeamManager';
import { CLUB_GAMES } from '../types';
import styles from './FiveClubs.module.css';

const gameConfig = CLUB_GAMES.FIVE;

const generateAttack = () => {
  const pattern = gameConfig.attackPatterns[Math.floor(Math.random() * gameConfig.attackPatterns.length)];
  const zone = gameConfig.defendZones[Math.floor(Math.random() * gameConfig.defendZones.length)];
  return { pattern, zone, timing: Date.now() };
};

const FiveClubs = () => {
  const { updateResults } = useGame();
  const [gameState, setGameState] = useState('PREPARING');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);
  const [attacks, setAttacks] = useState([]);
  const [playerDefense, setPlayerDefense] = useState(null);
  const [npcDefense, setNpcDefense] = useState(null);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleTeamFormed = useCallback(() => {
    setGameState('PLAYING');
  }, []);

  // Timer y generador de ataques
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev <= 1 ? 0 : prev - 1;
        // Solo actualizamos el estado de juego y resultados cuando realmente se acaba el tiempo
        if (newTime === 0) {
          // Usamos setTimeout para evitar actualización durante renderizado
          setTimeout(() => {
            setGameState('FINISHED');
            updateResults({
              score,
              success: score >= gameConfig.minScore
            });
          }, 0);
        }
        return newTime;
      });
    }, 1000);

    // Solo genera un nuevo ataque si no hay ataques o si el jugador ya defendió el actual
    const attackGenerator = setInterval(() => {
      setAttacks(prev => {
        // Limitar a máximo 1 ataque en pantalla
        if (prev.length === 0 || (prev[0].defended && prev.length < 2)) {
          return [...prev, { ...generateAttack(), defended: false }];
        }
        return prev;
      });
    }, gameConfig.attackSpeed);

    return () => {
      clearInterval(timer);
      clearInterval(attackGenerator);
    };
  }, [gameState, score, updateResults]);

  // Lógica del NPC mejorada
  useEffect(() => {
    if (gameState !== 'PLAYING' || !attacks.length || !playerDefense) return;

    const makeNPCMove = () => {
      const currentAttack = attacks[0];
      // 75% de probabilidad de acertar la dirección correcta
      const willDefendCorrectly = Math.random() < 0.75;
      
      if (willDefendCorrectly) {
        // El NPC elige la dirección correcta
        setNpcDefense(currentAttack.zone);
      } else {
        // El NPC elige una dirección incorrecta al azar
        const wrongZones = gameConfig.defendZones.filter(z => z !== currentAttack.zone);
        const randomZone = wrongZones[Math.floor(Math.random() * wrongZones.length)];
        setNpcDefense(randomZone);
      }
    };

    // El NPC espera un momento después de que el jugador elija
    const timer = setTimeout(makeNPCMove, gameConfig.turnDelay);
    return () => clearTimeout(timer);
  }, [attacks, gameState, playerDefense]);

  // Evaluar defensa
  const evaluateDefense = useCallback((playerZone, npcZone, attack) => {
    const playerCorrect = playerZone === attack.zone;
    const npcCorrect = npcZone === attack.zone;
    const bothCorrect = playerCorrect && npcCorrect;

    if (bothCorrect) {
      setCombo(prev => prev + 1);
      const points = gameConfig.perfectBlock * (combo >= 3 ? gameConfig.comboMultiplier : 1);
      setScore(prev => prev + points);
      setFeedback(`¡Defensa Perfecta! +${points} 🛡️✨`);
    } else if (playerCorrect || npcCorrect) {
      setCombo(0);
      setScore(prev => prev + gameConfig.goodBlock);
      setFeedback(`¡Defensa Parcial! +${gameConfig.goodBlock} 🛡️`);
    } else {
      setCombo(0);
      const newScore = Math.max(0, score + gameConfig.missedBlock);
      setScore(newScore);
      setFeedback(`¡Defensa Fallida! ${gameConfig.missedBlock} 💥`);
    }

    // Marca el ataque como defendido
    setAttacks(prev => 
      prev.map((a, i) => i === 0 ? { ...a, defended: true } : a)
    );

    setTimeout(() => setFeedback(''), 1500);
  }, [combo, score]);

  const handleDefend = (zone) => {
    if (gameState !== 'PLAYING' || !attacks.length || playerDefense) return;

    // El jugador hace su movimiento
    setPlayerDefense(zone);
    setFeedback('Esperando respuesta del compañero... 🤔');
  };

  // Evaluar las defensas cuando el NPC responde
  useEffect(() => {
    if (!playerDefense || !npcDefense || !attacks.length) return;

    const currentAttack = attacks[0];
    
    // Esperar un momento para mostrar ambas defensas
    setTimeout(() => {
      evaluateDefense(playerDefense, npcDefense, currentAttack);
      setAttacks(prev => prev.slice(1));
      setPlayerDefense(null);
      setNpcDefense(null);
    }, 1000);
  }, [npcDefense, playerDefense, attacks, evaluateDefense]);

  return (
    <div className={styles.container}>
      <PlayingCard cardId={gameConfig.id} />
      <div className={styles.header}>
        ♣ {gameConfig.name} | Tiempo: {timeLeft}s | Puntos: {score} | Combo: {combo}x
      </div>

      <TeamManager teamSize={gameConfig.teamSize} onTeamFormed={handleTeamFormed}>
        {(team) => (
          <div className={styles.gameArea}>
            {/* Zona de ataque */}
            <div className={styles.attackZone}>
              {attacks.map((attack, index) => (
                <div key={index} className={styles.attack}>
                  <div className={styles.attackSymbol}>{attack.pattern}</div>
                  <div className={styles.attackDirection}>→ {attack.zone}</div>
                </div>
              ))}
            </div>

            {/* Equipo de defensa */}
            <div className={styles.teamDisplay}>
              {team.map((player, index) => (
                <div key={player.id} className={styles.playerContainer}>
                  <img src={player.avatar} alt={player.name} className={styles.avatar} />
                  <div className={styles.playerName}>
                    {player.name} {index === 0 && '(Tú)'}
                  </div>
                  <div className={styles.defenseZone}>
                    {index === 0 ? playerDefense : npcDefense}
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <div className={styles.feedback}>
              {feedback}
            </div>

            {/* Controles de defensa */}
            {gameState === 'PLAYING' && (
              <div className={styles.controls}>
                {gameConfig.defendZones.map(zone => (
                  <button
                    key={zone}
                    onClick={() => handleDefend(zone)}
                    className={styles.controlButton}
                    disabled={!!playerDefense}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            )}

            {/* Resultados */}
            {gameState === 'FINISHED' && (
              <div className={styles.results}>
                <h3>Defensa Completada</h3>
                <div className={styles.finalScore}>
                  Puntuación Final: {score}
                </div>
                {score >= gameConfig.minScore ? (
                  <div className={styles.success}>¡Victoria en equipo!</div>
                ) : (
                  <div className={styles.failure}>Necesitan mejorar su coordinación</div>
                )}
              </div>
            )}
          </div>
        )}
      </TeamManager>
    </div>
  );
};

export default FiveClubs;