import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext.jsx';

const TwoSpades = () => {
  const { state, updateRoundResults, startNextRound } = useGame();
  
  const [power, setPower] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [maxPower, setMaxPower] = useState(0);

  const handleGameOver = useCallback(() => {
    if (timeLeft === 0) {
      updateRoundResults({
        game: 'TWO_SPADES',
        score: maxPower,
        success: maxPower >= 80,
        round: state.currentRound
      });
    }
  }, [timeLeft, maxPower, state.currentRound, updateRoundResults]);

  // Timer principal
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Efecto para manejar el fin del juego
  useEffect(() => {
    if (timeLeft === 0) {
      handleGameOver();
    }
  }, [timeLeft, handleGameOver]);

  // Efecto para la fuerza
  useEffect(() => {
    let powerInterval;
    if (isHolding && power < 100 && timeLeft > 0) {
      powerInterval = setInterval(() => {
        setPower(current => {
          const newPower = Math.min(current + 2, 100);
          setMaxPower(prev => Math.max(prev, newPower));
          return newPower;
        });
      }, 100);
    } else if (!isHolding && power > 0) {
      powerInterval = setInterval(() => {
        setPower(current => Math.max(current - 4, 0));
      }, 100);
    }

    return () => {
      if (powerInterval) {
        clearInterval(powerInterval);
      }
    };
  }, [isHolding, power, timeLeft]);

  const startHolding = () => timeLeft > 0 && setIsHolding(true);
  const stopHolding = () => setIsHolding(false);

  const getPowerColor = () => {
    if (power < 30) return 'bg-blue-500';
    if (power < 60) return 'bg-yellow-500';
    if (power < 90) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="mb-4 text-xl font-bold text-center">
        Ronda {state.currentRound} de {state.maxRounds} | 
        2♠ Mantén la Fuerza | Tiempo: {timeLeft}s | Poder Máximo: {maxPower}%
      </div>

      {timeLeft > 0 ? (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <div className="w-full h-8 bg-gray-700 rounded-full overflow-hidden mb-4">
            <div 
              className={`h-full ${getPowerColor()} transition-all duration-200`}
              style={{ width: `${power}%` }}
            />
          </div>

          <button
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
            className={`
              w-48 h-48 rounded-full
              ${isHolding ? getPowerColor() : 'bg-gray-600'}
              transform transition-all duration-100
              ${isHolding ? 'scale-95' : 'scale-100'}
              hover:shadow-lg focus:outline-none
              flex items-center justify-center text-white font-bold text-xl
            `}
          >
            {isHolding ? '¡MANTÉN!' : 'PRESIONA'}
          </button>

          <div className="mt-4 text-center">
            <p>Mantén presionado para acumular fuerza</p>
            <p>Poder actual: {power}%</p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {maxPower >= 80 ? '¡Victoria!' : 'No alcanzaste el poder necesario'}
          </h2>
          <div className="space-y-2">
            <p>Poder máximo alcanzado: {maxPower}%</p>
            <p>Nivel requerido: 80%</p>
          </div>
          <button
            onClick={startNextRound}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            {state.currentRound < state.maxRounds ? 'Siguiente Ronda' : 'Ver Resultados'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoSpades;