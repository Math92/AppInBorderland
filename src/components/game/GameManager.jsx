import { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import styles from './GameManager.module.css';
import GameStart from './GameStart';
import AceSpades from '../../games/spades/AceSpades';
import TwoSpades from '../../games/spades/TwoSpades';
import ThreeSpades from '../../games/spades/ThreeSpades';
import FourSpades from '../../games/spades/FourSpades';

const GameManager = () => {
  // Obtenemos state y dispatch del contexto a través de useGame
  const { state, startGame, resetGame } = useGame();

  useEffect(() => {
    if (state.gameState === 'PLAYING' && !state.currentCard) {
      startGame();
    }
  }, [state.gameState, state.currentCard, startGame]);

  const renderCurrentGame = () => {
    if (!state.currentCard) {
      return null;
    }

    const gameMap = {
      'A-spades': AceSpades,
      '2-spades': TwoSpades,
      '3-spades': ThreeSpades,
      '4-spades': FourSpades
    };

    const GameComponent = gameMap[state.currentCard.id];

    return GameComponent ? <GameComponent /> : (
      <div className={styles.unavailableGame}>Juego no disponible</div>
    );
  };

  const renderResults = () => {
    if (!state.currentGameResults || !state.allPlayersResults) return null;

    const mainCharacters = state.allPlayersResults.filter(player => player.isMainCharacter);
    const npcs = state.allPlayersResults.filter(player => !player.isMainCharacter);
    const survivingNPCs = npcs.filter(npc => npc.score >= 50).length;

    return (
      <div className={styles.resultsContainer}>
        <h2 className={styles.resultsTitle}>Resultados del Juego</h2>

        {/* Resultado del jugador */}
        <div className={styles.playerResults}>
          <h3 className={styles.sectionTitle}>Tu Resultado</h3>
          <div className={styles.characterCard}>
            <img
              src={state.selectedCharacter.avatar}
              alt={`Avatar de ${state.selectedCharacter.name}`}
              className={styles.characterAvatar}
            />
            <div className={styles.characterName}>{state.selectedCharacter.name}</div>
            <div className={`${styles.resultCard} ${state.currentGameResults.success ? styles.success : styles.failure}`}>
              <div className={styles.resultStatus}>
                {state.currentGameResults.success ? '¡SOBREVIVISTE!' : 'GAME OVER'}
              </div>
              <div className={styles.score}>
                Puntuación: {state.currentGameResults.score}
              </div>
            </div>
          </div>
        </div>

        {/* Resultados de personajes principales */}
        <div className={styles.mainCharactersResults}>
        <h3 className={styles.sectionTitle}>Personajes Principales</h3>
        <div className={styles.charactersGrid}>
          {mainCharacters.map(char => (
            <div key={char.id} className={styles.characterCard}>
              <img 
                src={char.avatar}
                alt={`Avatar de ${char.name}`}
                className={styles.characterAvatar}
              />
              <div className={styles.characterName}>{char.name}</div>
              <div className={`${styles.characterStatus} ${char.score >= 50 ? styles.survived : styles.died}`}>
                {char.score >= 50 ? 'SOBREVIVIÓ' : 'ELIMINADO'}
              </div>
              <div className={styles.characterScore}>
                Puntuación: {char.score}
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* Resumen de NPCs */}
        <div className={styles.npcSummary}>
          <h3 className={styles.sectionTitle}>Otros Jugadores</h3>
          <div className={styles.npcStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{survivingNPCs}</div>
              <div className={styles.statLabel}>Sobrevivientes</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{npcs.length - survivingNPCs}</div>
              <div className={styles.statLabel}>Eliminados</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{((survivingNPCs / npcs.length) * 100).toFixed(1)}%</div>
              <div className={styles.statLabel}>Tasa de Supervivencia</div>
            </div>
          </div>
        </div>

        {/* Botón para continuar */}
        <button
          onClick={resetGame}
          className={styles.continueButton}
        >
          Siguiente Ronda
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameCard}>
        {state.gameState === 'CHARACTER_SELECTION' && <GameStart />}
        {state.gameState === 'PLAYING' && renderCurrentGame()}
        {state.gameState === 'FINISHED' && renderResults()}
      </div>
    </div>
  );
};

export default GameManager;