import { useGame } from '../../context/GameContext';
import GameStart from './GameStart';
import AceSpades from '../../games/spades/AceSpades';
import TwoSpades from '../../games/spades/TwoSpades';
import ThreeSpades from '../../games/spades/ThreeSpades';
import RoundResults from './RoundResults';

const GameManager = () => {
  const { state } = useGame();

  const renderCurrentGame = () => {
    if (!state.currentCard) return null;

    const gameMap = {
      'A-spades': AceSpades,
      '2-spades': TwoSpades,
      '3-spades': ThreeSpades
    };

    const GameComponent = gameMap[state.currentCard.id];
    
    return GameComponent ? <GameComponent /> : (
      <div className="text-white text-center">Juego no disponible</div>
    );
  };

  const renderFinalResults = () => (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Resultados Finales</h2>
        <div className="space-y-4">
          {state.roundResults.map((result, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl mb-2">Ronda {result.round}</h3>
              <p className={result.playerResult.success ? 'text-green-400' : 'text-red-400'}>
                {result.playerResult.success ? '¡Victoria!' : 'Derrota'}
              </p>
              <p>Puntuación: {result.playerResult.score}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {state.gameState === 'CHARACTER_SELECTION' && <GameStart />}
      {state.gameState === 'READY_TO_START' && <GameStart />}
      {state.gameState === 'PLAYING' && renderCurrentGame()}
      {state.gameState === 'SHOWING_RESULTS' && (
        <RoundResults
          roundNumber={state.currentRound}
          maxRounds={state.maxRounds}
          playerResult={state.currentRoundResults?.playerResult}
          mainCharacters={state.allPlayersResults?.filter(p => p.isMainCharacter)}
          npcResults={state.allPlayersResults?.filter(p => !p.isMainCharacter)}
          onNextRound={() => {}}
        />
      )}
      {state.gameState === 'FINISHED' && renderFinalResults()}
    </div>
  );
};

export default GameManager;