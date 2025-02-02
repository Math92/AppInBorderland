// GameManager.jsx
import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { db } from '../../firebase';
import styles from './GameManager.module.css';
import GameStart from './GameStart';
import AceSpades from '../../games/spades/AceSpades';
import TwoSpades from '../../games/spades/TwoSpades';
import ThreeSpades from '../../games/spades/ThreeSpades';
import FourSpades from '../../games/spades/FourSpades';
import AceHearts from '../../games/hearts/AceHearts';
import TwoHearts from '../../games/hearts/TwoHearts';
import ThreeHearts from '../../games/hearts/ThreeHearts';
import AceDiamonds from '../../games/diamonds/AceDiamonds';
import TwoDiamonds from '../../games/diamonds/TwoDiamonds';
import PlayingCard from '../Card/PlayingCard';
import ThreeDiamonds from '../../games/diamonds/ThreeDiamonds';
import ThreeClubs from './../../games/clubs/ThreeClubs';
import AceClubs from '../../games/clubs/AceClubs';
import TwoClubs from '../../games/clubs/TwoClubs';

const GameManager = () => {
  const { state, startGame, resetGame } = useGame();
  const [cardEarned, setCardEarned] = useState(false);

  useEffect(() => {
    if (state.gameState === 'PLAYING' && !state.currentCard) {
      startGame();
    }
  }, [state.gameState, state.currentCard, startGame]);

  // Función para actualizar las cartas del usuario
  const updateUserCards = async (gameResult) => {
    if (gameResult.success && state.currentCard) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser?.id) return;

        const userDoc = await db.collection('users').doc(currentUser.id).get();
        if (!userDoc) return;

        const [rank, suit] = state.currentCard.id.split('-');
        const currentCards = userDoc.cards || {};

        // Verificar si ya tiene la carta
        if (currentCards[suit]?.[rank]) {
          return;
        }

        // Actualizar las cartas
        const updatedCards = {
          ...currentCards,
          [suit]: {
            ...(currentCards[suit] || {}),
            [rank]: true
          }
        };

        // Actualizar en la base de datos
        await db.collection('users').doc(currentUser.id).update({
          cards: updatedCards
        });

        // Actualizar localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          ...currentUser,
          cards: updatedCards
        }));

        setCardEarned(true);
      } catch (error) {
        console.error('Error actualizando cartas:', error);
      }
    }
  };

  useEffect(() => {
    if (state.gameState === 'FINISHED' && state.currentGameResults) {
      updateUserCards(state.currentGameResults);
    }
  }, [state.gameState, state.currentGameResults]);

  const renderCurrentGame = () => {
    if (!state.currentCard) return null;

    const gameMap = {
      'A-spades': AceSpades,
      '2-spades': TwoSpades,
      '3-spades': ThreeSpades,
      '4-spades': FourSpades,
      'A-hearts': AceHearts,
      '2-hearts': TwoHearts,
      '3-hearts': ThreeHearts,
      'A-diamonds': AceDiamonds,
      '2-diamonds': TwoDiamonds,
      '3-diamonds': ThreeDiamonds,
      '3-clubs': ThreeClubs,
      'A-clubs': AceClubs,
      '2-clubs': TwoClubs
    };

    const GameComponent = gameMap[state.currentCard.id];
    return GameComponent ? <GameComponent /> : (
      <div className={styles.unavailableGame}>Juego no disponible</div>
    );
  };

  // GameManager.jsx - renderResults function
const renderResults = () => {
  if (!state.currentGameResults) return null;

  return (
    <div className={styles.resultsContainer}>
      <h2 className={styles.resultsTitle}>Resultados del Juego</h2>

      {cardEarned && (
        <div className={styles.cardEarnedMessage}>
          ¡Has obtenido una nueva carta para tu colección! 🎴
        </div>
      )}

      <div className={styles.playerResults}>
        <h3 className={styles.sectionTitle}>Tu Resultado</h3>
        <div className={styles.characterCard}>
          <img
            src={state.selectedCharacter.avatar}
            alt={`Avatar de ${state.selectedCharacter.name}`}
            className={styles.characterAvatar}
          />
          <div className={styles.characterName}>
            {state.selectedCharacter.name}
          </div>
          <div 
            className={`${styles.resultCard} ${
              state.currentGameResults.success ? styles.success : styles.failure
            }`}
          >
            <div className={styles.resultStatus}>
              {state.currentGameResults.success ? (
                <>¡SOBREVIVISTE! <span role="img" aria-label="victoria">🎉</span></>
              ) : (
                <>GAME OVER <span role="img" aria-label="derrota">💀</span></>
              )}
            </div>
            <div className={styles.score}>
              Puntuación: {state.currentGameResults.score}
            </div>
          </div>
        </div>
      </div>

      {state.currentGameResults.success && state.currentCard && (
        <div className={styles.earnedCard}>
          <h3 className={styles.sectionTitle}>Carta Obtenida</h3>
          <PlayingCard cardId={state.currentCard.id} size="large" />
        </div>
      )}

      <button
        onClick={() => {
          setCardEarned(false);
          resetGame();
        }}
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