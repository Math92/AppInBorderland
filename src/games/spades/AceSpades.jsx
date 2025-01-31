import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext.jsx';

const AceSpades = () => {
  const { state, updateRoundResults, startNextRound } = useGame();
  
  // Estados locales
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); // Reducido a 20 segundos
  const [gameStatus, setGameStatus] = useState('PLAYING');
  const [clickRate, setClickRate] = useState(0);
  const [startTime] = useState(Date.now());

  // Función para calcular la velocidad de clicks
  const calculateClickRate = useCallback(() => {
    const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
    return elapsedTimeInSeconds > 0 ? (clicks / elapsedTimeInSeconds).toFixed(1) : 0;
  }, [clicks, startTime]);

  // Timer principal del juego que corre independientemente
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          setGameStatus('FINISHED');
          
          // Actualizar resultados finales
          updateRoundResults({
            game: 'ACE_SPADES',
            score: clicks,
            clickRate: calculateClickRate(),
            success: clicks >= 50,
            round: state.currentRound
          });
          
          return 0;
        }
        return prev - 1;
      });
      
      setClickRate(calculateClickRate());
    }, 1000);

    return () => clearInterval(interval);
  }, [clicks, calculateClickRate, updateRoundResults, state.currentRound]);

  // Manejar clicks
  const handleClick = () => {
    if (gameStatus === 'PLAYING' && timeLeft > 0) {
      setClicks(prev => prev + 1);
    }
  };

  // Efectos visuales de fuerza
  const getPunchEffect = () => {
    if (clicks < 20) return 'bg-red-300';
    if (clicks < 35) return 'bg-red-500';
    return 'bg-red-700';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="mb-4 text-xl font-bold text-center">
        Ronda {state.currentRound} de {state.maxRounds} | 
        A♠ Golpes Rápidos | Tiempo: {timeLeft}s | 
        Golpes: {clicks} | Velocidad: {clickRate} g/s
      </div>

      {gameStatus === 'PLAYING' && (
        <div className="flex flex-col items-center">
          <button
            onClick={handleClick}
            className={`
              w-48 h-48 rounded-full 
              ${getPunchEffect()}
              transform transition-all duration-100 active:scale-95
              hover:shadow-lg focus:outline-none
              flex items-center justify-center text-white font-bold text-2xl
            `}
          >
            ¡GOLPEA!
          </button>

          <div className="mt-4 w-full max-w-md bg-gray-700 h-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-200"
              style={{ width: `${(clicks / 50) * 100}%` }}
            />
          </div>

          <div className="mt-2 text-sm text-gray-300">
            Objetivo: 50 golpes
          </div>
        </div>
      )}

      {gameStatus === 'FINISHED' && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {clicks >= 50 ? '¡Victoria!' : 'Necesitas más entrenamiento'}
          </h2>
          <div className="space-y-2">
            <p>Total de golpes: {clicks}</p>
            <p>Velocidad final: {clickRate} golpes/segundo</p>
            <p>
              Estado: {clicks >= 50 ? (
                <span className="text-green-500">Superado</span>
              ) : (
                <span className="text-red-500">No alcanzado</span>
              )}
            </p>
            <button
              onClick={startNextRound}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              {state.currentRound < state.maxRounds ? 'Siguiente Ronda' : 'Ver Resultados'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AceSpades;