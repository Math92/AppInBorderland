// Tipos de juegos de picas (Fuerza)
export const SPADE_GAMES = {
    ACE: {
      id: 'ace-spades',
      name: 'Golpes Rápidos',
      description: 'Pulsa lo más rápido posible para simular golpes de fuerza',
      difficulty: 1,
      maxTime: 30, // segundos
      minScore: 50 // clicks necesarios para ganar
    },
    TWO: {
      id: 'two-spades',
      name: 'Mantén la Fuerza',
      description: 'Mantén presionada la barra espaciadora para acumular fuerza',
      difficulty: 2,
      maxTime: 45,
      minPower: 80 // porcentaje de fuerza necesario
    },
    THREE: {
      id: 'three-spades',
      name: 'Combo de Poder',
      description: 'Realiza la secuencia de teclas para ejecutar combos de fuerza',
      difficulty: 3,
      maxTime: 60,
      minCombos: 5
    },
    FOUR: {
      id: 'four-spades',
      name: 'Resistencia Extrema',
      description: 'Alterna clicks rápidos con mantener presionado',
      difficulty: 4,
      maxTime: 90,
      minScore: 100
    }
  };