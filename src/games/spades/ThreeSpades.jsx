import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext.jsx';

const ThreeSpades = () => {
  const { state, updateRoundResults, startNextRound } = useGame();
  const [timeLeft, setTimeLeft] = useState(40);
  const [score, setScore] = useState(0);
  const [currentCombo, setCurrentCombo] = useState([]);
  const [targetCombo, setTargetCombo] = useState([]);
  const [comboSuccess, setComboSuccess] = useState(false);

  const possibleButtons = ['↑', '↓', '←', '→'];
  const COMBO_LENGTH = 4;
  const REQUIRED_COMBOS = 5;

  // Generar nuevo combo objetivo
  const generateNewCombo = useCallback(() => {
    const newCombo = [];
    for (let i = 0; i < COMBO_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * possibleButtons.length);
      newCombo.push(possibleButtons[randomIndex]);
    }
    setTargetCombo(newCombo);
    setCurrentCombo([]);
    setComboSuccess(false);
  }, []);

  // Inicializar juego
  useEffect(() => {
    generateNewCombo();
  }, []);

  // Timer del juego
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Enviamos resultados cuando el tiempo llega a 0
            updateRoundResults({
              game: 'THREE_SPADES',
              score,
              success: score >= REQUIRED_COMBOS,
              round: state.currentRound
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  // Manejar input del jugador
  const handleButtonPress = useCallback((direction) => {
    if (timeLeft === 0) return;

    const newCombo = [...currentCombo, direction];
    setCurrentCombo(newCombo);

    // Verificar si el botón presionado es correcto
    if (newCombo[newCombo.length - 1] !== targetCombo[newCombo.length - 1]) {
      setTimeout(() => {
        setCurrentCombo([]);
        setComboSuccess(false);
      }, 100);
      return;
    }

    // Si completamos el combo correctamente
    if (newCombo.length === targetCombo.length) {
      setScore(prev => prev + 1);
      setComboSuccess(true);
      setTimeout(() => {
        generateNewCombo();
      }, 500);
    }
  }, [currentCombo, targetCombo, timeLeft, generateNewCombo]);

  const getButtonColor = useCallback((button, index) => {
    if (!currentCombo[index]) return 'bg-gray-600';
    if (currentCombo[index] === targetCombo[index]) return 'bg-green-500';
    return 'bg-red-500';
  }, [currentCombo, targetCombo]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="mb-4 text-xl font-bold text-center">
        Ronda {state.currentRound} de {state.maxRounds} | 
        3♠ Combo de Poder | Tiempo: {timeLeft}s | Combos: {score}/{REQUIRED_COMBOS}
      </div>

      {timeLeft > 0 ? (
        <div className="flex flex-col items-center">
          {/* Combo objetivo */}
          <div className="mb-6">
            <p className="text-white mb-2">Combo a realizar:</p>
            <div className="flex gap-2">
              {targetCombo.map((button, index) => (
                <div 
                  key={index}
                  className="w-12 h-12 bg-gray-700 flex items-center justify-center text-white rounded-lg"
                >
                  {button}
                </div>
              ))}
            </div>
          </div>

          {/* Combo actual */}
          <div className="mb-6">
            <p className="text-white mb-2">Tu combo:</p>
            <div className="flex gap-2">
              {targetCombo.map((_, index) => (
                <div 
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center text-white rounded-lg
                    ${getButtonColor(currentCombo[index], index)}`}
                >
                  {currentCombo[index] || '?'}
                </div>
              ))}
            </div>
          </div>

          {/* Controles */}
          <div className="grid grid-cols-3 gap-2 w-48 h-48">
            <div />
            <button
              onClick={() => handleButtonPress('↑')}
              className="bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl"
            >
              ↑
            </button>
            <div />
            <button
              onClick={() => handleButtonPress('←')}
              className="bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl"
            >
              ←
            </button>
            <div className="bg-gray-700 rounded-lg" />
            <button
              onClick={() => handleButtonPress('→')}
              className="bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl"
            >
              →
            </button>
            <div />
            <button
              onClick={() => handleButtonPress('↓')}
              className="bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl"
            >
              ↓
            </button>
            <div />
          </div>

          {comboSuccess && (
            <div className="mt-4 text-green-500 font-bold">
              ¡Combo Correcto!
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {score >= REQUIRED_COMBOS ? '¡Victoria!' : 'No completaste suficientes combos'}
          </h2>
          <div className="space-y-2">
            <p>Combos completados: {score}</p>
            <p>Objetivo: {REQUIRED_COMBOS} combos</p>
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

export default ThreeSpades;