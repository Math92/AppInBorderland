import PropTypes from 'prop-types';

const RoundResults = ({
  roundNumber,
  maxRounds,
  playerResult,
  mainCharacters,
  npcResults,
  onNextRound
}) => {
  // Verificamos que npcResults existe y es un array
  const safeNpcResults = Array.isArray(npcResults) ? npcResults : [];
  const npcWinners = safeNpcResults.filter(player => player && player.success).length;
  const safeMainCharacters = Array.isArray(mainCharacters) ? mainCharacters : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-center text-white">
              Resultados de la Ronda {roundNumber}
            </h2>
          </div>

          {/* Resultados del jugador */}
          {playerResult && (
            <div className="bg-gray-700 rounded-lg border border-gray-600 p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">Tu resultado:</h3>
              <div className={`text-lg ${playerResult.success ? 'text-green-400' : 'text-red-400'}`}>
                {playerResult.success ? '¡Victoria!' : 'Derrota'}
              </div>
              <div className="text-gray-200">
                Puntuación: {playerResult.score || 0}
              </div>
            </div>
          )}

          {/* Resultados de personajes principales */}
          {safeMainCharacters.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">Personajes Principales:</h3>
              <div className="grid gap-4">
                {safeMainCharacters.map(char => char && (
                  <div 
                    key={char.id || Math.random()} 
                    className="bg-gray-700 rounded-lg border border-gray-600 p-6"
                  >
                    <div className="font-bold text-white">{char.name}</div>
                    <div className={char.success ? 'text-green-400' : 'text-red-400'}>
                      {char.success ? 'Victoria' : 'Derrota'}
                    </div>
                    <div className="text-gray-200">
                      Puntuación: {char.score || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resumen de NPCs */}
          {safeNpcResults.length > 0 && (
            <div className="bg-gray-700 rounded-lg border border-gray-600 p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">Otros Jugadores:</h3>
              <div className="text-gray-200">
                {npcWinners} de {safeNpcResults.length} jugadores superaron la prueba
              </div>
            </div>
          )}

          {/* Botón para siguiente ronda */}
          <div className="text-center mt-6">
            <button
              onClick={onNextRound}
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-xl font-bold
                transition-all duration-300 transform hover:scale-105"
            >
              {roundNumber < maxRounds ? 'Siguiente Ronda' : 'Ver Resultados Finales'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

RoundResults.propTypes = {
  roundNumber: PropTypes.number.isRequired,
  maxRounds: PropTypes.number.isRequired,
  playerResult: PropTypes.shape({
    success: PropTypes.bool.isRequired,
    score: PropTypes.number.isRequired
  }),
  mainCharacters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    success: PropTypes.bool.isRequired,
    score: PropTypes.number.isRequired
  })),
  npcResults: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    success: PropTypes.bool.isRequired,
    score: PropTypes.number.isRequired
  })),
  onNextRound: PropTypes.func.isRequired
};

export default RoundResults;