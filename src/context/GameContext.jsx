// GameContext.jsx
import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { characters } from '../data/charactersData.js';
import { suits, ranks, calculateDifficulty } from '../data/cardData.js';

export const GAME_STATES = {
  CHARACTER_SELECTION: 'CHARACTER_SELECTION',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED'
};

const actionTypes = {
  SELECT_CHARACTER: 'SELECT_CHARACTER',
  START_GAME: 'START_GAME',
  UPDATE_RESULTS: 'UPDATE_RESULTS',
  RESET_GAME: 'RESET_GAME'
};

// Definimos las cartas implementadas usando el mismo patrón para todas
const IMPLEMENTED_CARDS = [
  // Cartas de picas (A, 2, 3, 4)
  ...ranks.slice(4, 5).map(rank => ({
    rank,
    suit: 'spades'
  })),
  // // Cartas de corazones (A, 2, 3)
  // ...ranks.slice(4, 5).map(rank => ({
  //   rank,
  //   suit: 'hearts'
  // })),
  // Cartas de diamantes (A, 2, 3, 4)
  // ...ranks.slice(4, 5).map(rank => ({
  //   rank,
  //   suit: 'diamonds'
  // })),
  // // Cartas de tréboles (3)
  // ...ranks.slice(0, 4).map(rank => ({
  //   rank,
  //   suit: 'clubs'
  // }))
];

const createInitialDeck = () => 
  IMPLEMENTED_CARDS.map(({ rank, suit }) => {
    // Log para debug
    console.log(`Creating card: ${rank}-${suit}`);
    return {
      id: `${rank}-${suit}`,
      rank,
      suit,
      symbol: suits[suit].symbol,
      type: suits[suit].type,
      description: suits[suit].description,
      difficulty: calculateDifficulty(rank),
      used: false
    };
  });

const generateNPCResults = (currentCard, mainPlayers, selectedCharacter) => {
  if (!currentCard || !mainPlayers || !selectedCharacter) return [];

  // Resultados para personajes principales (excluyendo al seleccionado)
  const mainPlayersResults = mainPlayers
    .filter(char => char.id !== selectedCharacter.id)
    .map(char => ({
      id: char.id,
      name: char.name,
      avatar: char.avatar,
      score: Math.floor(Math.random() * 100),
      isMainCharacter: true
    }));

  // Resultados para NPCs regulares
  const npcResults = Array.from({ length: 43 }, (_, index) => ({
    id: `npc-${index + 1}`,
    name: `Jugador ${index + 1}`,
    score: Math.floor(Math.random() * 100),
    isMainCharacter: false
  }));

  return [...mainPlayersResults, ...npcResults];
};

const initialState = {
  availableCharacters: characters,
  selectedCharacter: null,
  deck: createInitialDeck(),
  currentCard: null,
  gameState: GAME_STATES.CHARACTER_SELECTION,
  allPlayersResults: [],
  currentGameResults: null
};

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
      
      // Logs para debug
      console.log('Available cards:', availableCards);
      console.log('Selected card:', randomCard);
      
      const npcResults = generateNPCResults(
        randomCard, 
        state.availableCharacters, 
        state.selectedCharacter
      );

      // Actualizamos el estado marcando la carta como usada
      return {
        ...state,
        deck: state.deck.map(card => 
          card.id === randomCard.id ? { ...card, used: true } : card
        ),
        currentCard: randomCard,
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

export const GameContext = createContext();

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

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de un GameProvider');
  }
  return context;
};