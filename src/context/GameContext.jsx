import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { characters } from '../data/charactersData.js';
import { suits, ranks, calculateDifficulty } from '../data/cardData.js';
import { getRandomQuestion } from '../data/questionsData.js';

export const GAME_STATES = {
  CHARACTER_SELECTION: 'CHARACTER_SELECTION',
  READY_TO_START: 'READY_TO_START',
  PLAYING: 'PLAYING',
  SHOWING_RESULTS: 'SHOWING_RESULTS',
  FINISHED: 'FINISHED'
};

const actionTypes = {
  SELECT_CHARACTER: 'SELECT_CHARACTER',
  DRAW_CARD: 'DRAW_CARD',
  UPDATE_ROUND_RESULTS: 'UPDATE_ROUND_RESULTS',
  START_NEXT_ROUND: 'START_NEXT_ROUND',
  RESET_GAME: 'RESET_GAME'
};

const IMPLEMENTED_CARDS = ranks.slice(0, 3).map(rank => ({
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

  const mainPlayersResults = mainPlayers
    .filter(char => char.id !== selectedCharacter.id)
    .map(char => {
      const bonusProb = char.bonusTypes.includes(currentCard.suit) ? 0.2 : 0;
      const success = Math.random() < (char.luckyNumber + bonusProb);
      return {
        id: char.id,
        name: char.name,
        success,
        score: Math.floor(Math.random() * 100),
        isMainCharacter: true
      };
    });

  const npcResults = Array.from({ length: 43 }, (_, index) => ({
    id: `npc-${index + 1}`,
    name: `Jugador ${index + 1}`,
    success: Math.random() < 0.4,
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
  roundResults: [],
  currentRound: 1,
  maxRounds: 3,
  allPlayersResults: [],
  currentRoundResults: null
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SELECT_CHARACTER:
      return {
        ...state,
        selectedCharacter: action.payload,
        gameState: GAME_STATES.READY_TO_START
      };

    case actionTypes.DRAW_CARD: {
      const availableCards = state.deck.filter(card => !card.used);
      if (availableCards.length === 0) return state;
      
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      if (!randomCard) return state;

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
        deck: state.deck.map(card => 
          card.id === randomCard.id ? {...card, used: true} : card
        ),
        allPlayersResults: npcResults,
        gameState: GAME_STATES.PLAYING
      };
    }

    case actionTypes.UPDATE_ROUND_RESULTS: {
      const newRoundResult = {
        round: state.currentRound,
        playerResult: action.payload,
        npcResults: state.allPlayersResults,
        card: state.currentCard
      };

      const isFinalRound = state.currentRound >= state.maxRounds;

      return {
        ...state,
        roundResults: [...state.roundResults, newRoundResult],
        currentRoundResults: newRoundResult,
        gameState: isFinalRound ? GAME_STATES.FINISHED : GAME_STATES.SHOWING_RESULTS
      };
    }

    case actionTypes.START_NEXT_ROUND:
      return {
        ...state,
        currentRound: state.currentRound + 1,
        currentRoundResults: null,
        gameState: GAME_STATES.READY_TO_START
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

export const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const value = {
    state,
    selectCharacter: (character) => dispatch({ 
      type: actionTypes.SELECT_CHARACTER, 
      payload: character 
    }),
    drawCard: () => dispatch({ type: actionTypes.DRAW_CARD }),
    updateRoundResults: (results) => dispatch({
      type: actionTypes.UPDATE_ROUND_RESULTS,
      payload: results
    }),
    startNextRound: () => dispatch({ type: actionTypes.START_NEXT_ROUND }),
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
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};