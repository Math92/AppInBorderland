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
      maxTime: 10,
      minPower: 80 // porcentaje de fuerza necesario
    },
    THREE: {
      id: 'three-spades',
      name: 'Combo de Poder',
      description: 'Realiza la secuencia de teclas para ejecutar combos de fuerza',
      difficulty: 3,
      maxTime: 40,
      minCombos: 5
    },
    FOUR: {
      id: '4-spades',
      name: 'Dispara a los Objetivos',
      description: 'Pulsa en los objetivos que aparecen antes de que desaparezcan',
      difficulty: 4,
      maxTime: 30,
      minTarget: 20
    }
  };

// Tipos de juegos de corazones (Inteligencia Emocional)
export const HEART_GAMES = {
  ACE: {
    id: 'A-hearts',          // Mantenemos consistencia con GameManager
    name: 'Prueba de Inteligencia Emocional',
    description: 'Responde preguntas sobre situaciones emocionales',
    difficulty: 1,
    maxTime: 35,
    minScore: 500,
    questionsPerRound: 2,
    scoreMultiplier: 10,
    transitionDelay: 2000
  },
  TWO: {
    id: '2-hearts',
    name: 'Dilema del Prisionero',
    description: 'Pon a prueba tu confianza y lealtad en situaciones moralmente complejas',
    difficulty: 2,
    maxTime: 30,
    minScore: 40, // El puntaje mínimo para considerar "éxito"
    decisionTime: 30, // Tiempo para tomar la decisión
    transitionDelay: 5000 // Tiempo para mostrar consecuencias
  },
  THREE: {
    id: '3-hearts',
    name: 'Leer Emociones',
    description: 'Identifica emociones verdaderas detrás de expresiones engañosas',
    difficulty: 3,
    maxTime: 20,
    minScore: 60,
    scenariosPerRound: 2,
    scorePerScenario: 50,
    transitionDelay: 3000,
    feedbackDuration: 3000
  }
};