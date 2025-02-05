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
      minTarget: 10
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
  },
  FOUR: {
    id: '4-hearts',
    name: 'Patrones Emocionales',
    description: 'Analiza secuencias de emociones para predecir comportamientos',
    difficulty: 4,
    maxTime: 25,
    minScore: 70,
    patternsPerRound: 3,
    baseScore: 30,
    timeBonus: 0.5,
    explanationDelay: 3000,
    feedbackDuration: 3000
  }
};

// Tipos de juegos de diamantes (Astucia y Destreza Mental)
export const DIAMOND_GAMES = {
  ACE: {
    id: 'A-diamonds',
    name: 'Secuencias Lógicas',
    description: 'Resuelve patrones y secuencias numéricas',
    difficulty: 1,
    maxTime: 30,
    minScore: 60,
    sequencesPerRound: 2,
    scorePerSequence: 50,
    transitionDelay: 3000,
    feedbackDuration: 3000,
    hintPenalty: 10 // Penalización por usar pista
  },
  TWO: {
    id: '2-diamonds',
    name: 'Patrones de Memoria',
    description: 'Memoriza y reproduce secuencias de símbolos y colores',
    difficulty: 2,
    maxTime: 15, // 15 segundos para responder
    minScore: 70,
    baseScore: 30,
    maxLevels: 2,
    patternShowTime: 4000, // 4 segundos para mostrar el patrón
  },
  THREE: {
    id: '3-diamonds',
    name: 'Laberinto Mental',
    description: 'Navega por un laberinto generado aleatoriamente antes de que se agote el tiempo',
    difficulty: 3,
    maxTime: 30, // Tiempo total en segundos
    mazeConfig: {
    size: 8
    },
    timeBonus: {
    threshold: 15, // Segundos restantes para obtener bonificación
    points: 50 // Puntos extra por tiempo restante
    },
    baseScore: 100 // Puntuación base por completar
    },
    FOUR: {
      id: '4-diamonds',
      name: 'Secuencia Inversa',
      description: 'Resuelve secuencias numéricas en orden inverso bajo presión',
      difficulty: 4,
      maxTime: 45, // Tiempo total en segundos
      baseScore: 100,
      minScore: 70,
      sequenceLength: 5, // Longitud de la secuencia a memorizar
      displayTime: 5, // segundos para mostrar la secuencia inicial
      timeBonus: {
        threshold: 20, // Segundos restantes para obtener bonificación
        points: 50 // Puntos extra por tiempo restante
      }
    }
}


export const CLUB_GAMES = {
  ACE: {
    id: 'A-clubs',
    name: 'Coordinación de Colores',
    description: 'Selecciona el mismo color que tu compañero',
    difficulty: 1,
    maxTime: null,
    teamSize: 2,
    baseScore: 100,
    turnDelay: 1000
  },
  TWO: {
    id: '2-clubs',
    name: 'Doble Coordinación',
    description: 'Acierta dos colores en orden con tu compañero',
    difficulty: 2,
    maxTime: null,
    teamSize: 2,
    baseScore: 150,
    turnDelay: 1000
  },
  THREE: {
    id: '3-clubs',
    name: 'Suma en Equipo',
    description: 'Colabora para alcanzar un número objetivo tirando dados',
    difficulty: 3,
    maxTime: 20,
    teamSize: 2, // Número de jugadores requeridos
    baseScore: 100,
    turnDelay: 1500, // Tiempo de espera entre turnos de NPCs
    targetRange: {
      min: 5,
      max: 15
    },
    minScore: 60
  },
  // Aquí puedes agregar más juegos de tréboles siguiendo el mismo patrón
};