// Tipos de juegos de picas (Fuerza)
export const SPADE_GAMES = {
    ACE: {
      id: 'ace-spades',
      name: 'Golpes Rápidos',
      description: 'Pulsa lo más rápido posible para simular golpes de fuerza',
      difficulty: 1,
      maxTime: 10, // segundos
      minScore: 50 // clicks necesarios para ganar
    },
    TWO: {
      id: 'two-spades',
      name: 'Mantén la Fuerza',
      description: 'Mantén presionada la barra espaciadora para acumular fuerza',
      difficulty: 2,
      maxTime: 15,
      minPower: 80 // porcentaje de fuerza necesario
    },
    THREE: {
      id: 'three-spades',
      name: 'Combo de Poder',
      description: 'Realiza la secuencia de teclas para ejecutar combos de fuerza',
      difficulty: 3,
      maxTime: 30,
      minCombos: 5
    },
  };