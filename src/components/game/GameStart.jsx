import { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';

const GameStart = () => {
  const { state, selectCharacter, drawCard } = useGame();
  const [npcResults, setNpcResults] = useState([]);

  const generateNPCResults = () => {
    const mainPlayersResults = state.availableCharacters
      .filter(char => char !== state.selectedCharacter)
      .map(char => ({
        id: char.id,
        name: char.name,
        success: Math.random() < char.luckyNumber,
        score: Math.floor(Math.random() * 100)
      }));

    const npcResults = Array.from({ length: 43 }, (_, index) => ({
      id: mainPlayersResults.length + index + 1,
      name: `Jugador ${index + 1}`,
      success: Math.random() < 0.5,
      score: Math.floor(Math.random() * 100)
    }));

    setNpcResults([...mainPlayersResults, ...npcResults]);
  };

  const handleCharacterSelect = (character) => {
    selectCharacter(character);
    generateNPCResults();
  };

  const handleStartRound = () => {
    drawCard();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {state.gameState === 'CHARACTER_SELECTION' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Selecciona tu personaje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.availableCharacters.map((character) => (
              <div
                key={character.id}
                onClick={() => handleCharacterSelect(character)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  state.selectedCharacter?.id === character.id 
                    ? 'bg-purple-600' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{character.name}</h3>
                <p className="text-gray-300 mb-2">{character.description}</p>
                <p className="text-purple-300">Habilidad: {character.specialAbility}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.gameState === 'READY_TO_START' && (
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ronda {state.currentRound} de {state.maxRounds}
          </h2>
          <div className="mb-6">
            <h3 className="text-2xl mb-2">Tu personaje:</h3>
            <div className="bg-gray-800 p-4 rounded-lg inline-block">
              <p className="text-xl font-bold">{state.selectedCharacter.name}</p>
              <p className="text-gray-300">{state.selectedCharacter.description}</p>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-lg">Jugadores en la partida: 50</p>
            <p className="text-gray-300">7 Jugadores principales + 43 participantes</p>
          </div>
          <button
            onClick={handleStartRound}
            className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-xl font-bold
              transition-all duration-300 transform hover:scale-105"
          >
            {state.currentRound === 1 ? 'Comenzar Juego' : 'Siguiente Ronda'}
          </button>
        </div>
      )}

      {state.gameState === 'PLAYING' && npcResults.length > 0 && (
        <div className="fixed top-4 right-4 bg-gray-800 p-4 rounded-lg max-w-xs">
          <h3 className="font-bold mb-2">Resultados de otros jugadores:</h3>
          <div className="max-h-60 overflow-y-auto">
            {npcResults.map((result) => (
              <div 
                key={result.id}
                className={`text-sm mb-1 ${result.success ? 'text-green-400' : 'text-red-400'}`}
              >
                {result.name}: {result.success ? 'Superado' : 'Fallido'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStart;