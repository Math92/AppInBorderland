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

const IMPLEMENTED_CARDS = ranks.slice(0, 4).map(rank => ({
  rank,
  suit: 'spades'
}));

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
      
      const npcResults = generateNPCResults(
        randomCard, 
        state.availableCharacters, 
        state.selectedCharacter
      );

      return {
        ...state,
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