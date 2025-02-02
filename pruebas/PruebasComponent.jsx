// PruebasComponent.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../src/context/GameContext';
import styles from './PruebasComponent.module.css';
import PlayingCard from '../src/components/Card/PlayingCard';

// Importar todos los componentes de juego
const gameComponents = {
    // Spades
    'A-spades': () => import('../src/games/spades/AceSpades'),
    '2-spades': () => import('../src/games/spades/TwoSpades'),
    '3-spades': () => import('../src/games/spades/ThreeSpades'),
    '4-spades': () => import('../src/games/spades/FourSpades'),
  
    // Hearts
    'A-hearts': () => import('../src/games/hearts/AceHearts'),
    '2-hearts': () => import('../src/games/hearts/TwoHearts'),
    '3-hearts': () => import('../src/games/hearts/ThreeHearts'),
  
    // Diamonds
    'A-diamonds': () => import('../src/games/diamonds/AceDiamonds'),
    '2-diamonds': () => import('../src/games/diamonds/TwoDiamonds'),
    '3-diamonds': () => import('../src/games/diamonds/ThreeDiamonds'),
  
    // Clubs
    '3-clubs': () => import('../src/games/clubs/ThreeClubs')
  };

const PruebasComponent = () => {
  const { state, startGame, resetGame, selectCharacter, updateResults } = useGame();
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentGameComponent, setCurrentGameComponent] = useState(null);
  const navigate = useNavigate();

  // Configuración automática para pruebas
  useEffect(() => {
    if (!state.selectedCharacter && state.availableCharacters.length > 0) {
      selectCharacter(state.availableCharacters[0]);
    }
  }, [state.selectedCharacter, state.availableCharacters, selectCharacter]);

  // Cargar dinámicamente el componente del juego
  useEffect(() => {
    if (state.currentCard?.id && gameComponents[state.currentCard.id]) {
      gameComponents[state.currentCard.id]()
        .then(module => setCurrentGameComponent(module.default))
        .catch(() => setCurrentGameComponent(null));
    }
  }, [state.currentCard]);

  const handleStartTest = () => {
    if (selectedCard) {
      resetGame(); // Limpiar estado previo
      startGame(selectedCard);
    }
  };

  const handleGameComplete = (results) => {
    const mockResults = {
      ...results,
      preventStorage: true,
      isTest: true // Nueva bandera
    };
    updateResults(mockResults);
  };

  const handleFullReset = () => {
    setSelectedCard(null);
    setCurrentGameComponent(null);
    resetGame();
  };

  const renderGameComponent = () => {
    if (!currentGameComponent || !state.currentCard) return null;
    
    const GameComponent = currentGameComponent;
    return (
      <GameComponent 
        isTestMode={true}
        onComplete={handleGameComplete}
        key={state.currentCard.id} // Forzar reinicio al cambiar carta
      />
    );
  };

  const renderResults = () => {
    if (!state.currentGameResults) return null;
  
    return (
      <div className={styles.resultsContainer}>
        <h2>Resultados de la Prueba</h2>
  
        {/* Sección de mensaje de carta obtenida solo para modo normal */}
        {!state.currentGameResults.preventStorage && state.currentGameResults.success && (
          <div className={styles.cardEarnedMessage}>
            ¡Has obtenido una nueva carta! 🎴
          </div>
        )}
  
        <div className={styles.resultCard}>
          <p>Estado: {state.currentGameResults.success ? 'Éxito' : 'Fallo'}</p>
          <p>Puntuación: {state.currentGameResults.score}</p>
          <PlayingCard cardId={state.currentCard.id} size="medium" />
        </div>
  
        <div className={styles.buttonGroup}>
          <button onClick={handleFullReset} className={styles.testButton}>
            Nueva prueba
          </button>
          <button onClick={() => navigate('/')} className={styles.testButton}>
            Salir del modo pruebas
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {state.gameState === 'PLAYING' && renderGameComponent()}
      {state.gameState === 'FINISHED' && renderResults()}

      {state.gameState === 'CHARACTER_SELECTION' && (
        <div className={styles.testPanel}>
          <h2>Panel de Pruebas - Modo Administrador</h2>
          <div className={styles.cardGrid}>
            {state.deck.map((card) => (
              <div
                key={card.id}
                className={`${styles.cardItem} ${
                  selectedCard?.id === card.id ? styles.selectedCard : ''
                }`}
                onClick={() => setSelectedCard(card)}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardRank}>{card.rank}</span>
                  <span className={styles.cardSuit}>{card.symbol}</span>
                </div>
                <div className={styles.cardInfo}>
                  <p>Dificultad: {card.difficulty}</p>
                  <p>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.controls}>
            <button
              onClick={handleStartTest}
              disabled={!selectedCard}
              className={styles.testButton}
            >
              Iniciar Prueba
            </button>
            <button
              onClick={handleFullReset}
              className={styles.testButton}
            >
              Reiniciar Todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PruebasComponent;