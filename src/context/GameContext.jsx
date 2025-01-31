import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { characters } from '../data/charactersData.js';
import { suits, ranks, calculateDifficulty } from '../data/cardData.js';
import { getRandomQuestion } from '../data/questionsData.js';

// Estados del juego
export const GAME_STATES = {
  CHARACTER_SELECTION: 'CHARACTER_SELECTION', // Selección inicial del personaje
  PLAYING: 'PLAYING',           // Jugando la partida
  FINISHED: 'FINISHED'          // Juego terminado
};

// Tipos de acciones para el reducer
const actionTypes = {
  SELECT_CHARACTER: 'SELECT_CHARACTER',
  START_GAME: 'START_GAME',
  UPDATE_RESULTS: 'UPDATE_RESULTS',
  RESET_GAME: 'RESET_GAME'
};

// Configuración de cartas implementadas (solo picas)
const IMPLEMENTED_CARDS = ranks.slice(0, 3).map(rank => ({
  rank,
  suit: 'spades'
}));

// Crear mazo inicial
const createInitialDeck = () => 
  IMPLEMENTED_CARDS.map(({ rank, suit }) => ({
    id: `${rank}-${suit}`,
    rank,
    suit,
    symbol: suits[suit].symbol,
    type: suits[suit].type,
    description: suits[suit].description,
    difficulty: calculateDifficulty(rank),
    used: false
  }));

// Generar resultados de NPCs
const generateNPCResults = (currentCard, mainPlayers, selectedCharacter) => {
  if (!currentCard || !mainPlayers || !selectedCharacter) return [];

  // Resultados de personajes principales (excluyendo al seleccionado)
  const mainPlayersResults = mainPlayers
    .filter(char => char.id !== selectedCharacter.id)
    .map(char => ({
      id: char.id,
      name: char.name,
      success: Math.random() < char.luckyNumber,
      score: Math.floor(Math.random() * 100),
      isMainCharacter: true
    }));

  // Resultados de NPCs genéricos
  const npcResults = Array.from({ length: 43 }, (_, index) => ({
    id: `npc-${index + 1}`,
    name: `Jugador ${index + 1}`,
    success: Math.random() < 0.4,
    score: Math.floor(Math.random() * 100),
    isMainCharacter: false
  }));

  return [...mainPlayersResults, ...npcResults];
};

// Estado inicial del juego
const initialState = {
  availableCharacters: characters,
  selectedCharacter: null,
  deck: createInitialDeck(),
  currentCard: null,
  gameState: GAME_STATES.CHARACTER_SELECTION,
  allPlayersResults: [],
  currentGameResults: null
};

// Reducer del juego
const gameReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SELECT_CHARACTER:
      return {
        ...state,
        selectedCharacter: action.payload,
        gameState: GAME_STATES.PLAYING
      };

    case actionTypes.START_GAME: {
      const availableCards = state.deck.filter(card => !card.used);
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      
      const npcResults = generateNPCResults(
        randomCard, 
        state.availableCharacters, 
        state.selectedCharacter
      );

      return {
        ...state,
        currentCard: {
          ...randomCard,
          question: getRandomQuestion(randomCard.suit, randomCard.difficulty)
        },
        allPlayersResults: npcResults
      };
    }

    case actionTypes.UPDATE_RESULTS:
      return {
        ...state,
        currentGameResults: action.payload,
        gameState: GAME_STATES.FINISHED
      };

    case actionTypes.RESET_GAME:
      return {
        ...initialState,
        deck: createInitialDeck()
      };

    default:
      return state;
  }
};

// Contexto y Provider
export const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const value = {
    state,
    selectCharacter: (character) => dispatch({ 
      type: actionTypes.SELECT_CHARACTER, 
      payload: character 
    }),
    startGame: () => dispatch({ type: actionTypes.START_GAME }),
    updateResults: (results) => dispatch({
      type: actionTypes.UPDATE_RESULTS,
      payload: results
    }),
    resetGame: () => dispatch({ type: actionTypes.RESET_GAME })
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

GameProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Hook personalizado para usar el contexto
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de un GameProvider');
  }
  return context;
};