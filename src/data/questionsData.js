export const gameQuestions = {
    hearts: {
      easy: [
        {
          question: "¿Cuántas flexiones puedes hacer en 1 minuto?",
          type: "input",
          minValue: 10,
          maxValue: 50,
          success: (value) => parseInt(value) >= 20
        },
        {
          question: "Realiza 20 saltos de tijera",
          type: "timer",
          timeLimit: 30,
          success: (time) => time <= 30
        }
      ],
      medium: [
        {
          question: "Completa una carrera de obstáculos",
          type: "checkpoint",
          checkpoints: 3,
          timeLimit: 120
        },
        {
          question: "Mantén el equilibrio sobre un pie",
          type: "timer",
          timeLimit: 60
        }
      ],
      hard: [
        {
          question: "Compite en una prueba de resistencia",
          type: "endurance",
          stages: 5,
          timePerStage: 180
        }
      ]
    },
    diamonds: {
      easy: [
        {
          question: "¿Qué número estoy pensando entre 1 y 10?",
          type: "choice",
          options: [1,2,3,4,5,6,7,8,9,10],
          correctAnswer: () => Math.floor(Math.random() * 10) + 1
        }
      ],
      medium: [
        {
          question: "Resuelve este acertijo psicológico",
          type: "riddle",
          content: "En una habitación hay 3 personas. Una siempre miente, otra siempre dice la verdad, y la tercera alterna entre mentir y decir la verdad. ¿Qué pregunta harías para identificar a cada uno?",
          options: [
            "¿Quién eres tú?",
            "¿Qué dirían los otros sobre ti?",
            "Si te preguntara mañana, ¿qué responderías?",
            "¿Cuántas personas dicen la verdad aquí?"
          ]
        }
      ],
      hard: [
        {
          question: "Determina quién miente en esta situación",
          type: "scenario",
          scenario: "Tres sospechosos dan sus coartadas. Solo uno dice la verdad. Analiza sus declaraciones y encuentra al culpable."
        }
      ]
    },
    clubs: {
      easy: [
        {
          question: "Organiza un equipo de 3 personas",
          type: "team",
          teamSize: 3,
          timeLimit: 60
        }
      ],
      medium: [
        {
          question: "Coordina una estrategia grupal",
          type: "strategy",
          players: 5,
          rounds: 3
        }
      ],
      hard: [
        {
          question: "Lidera una misión de equipo",
          type: "mission",
          teamSize: 7,
          objectives: 3
        }
      ]
    },
    spades: {
      easy: [
        {
          question: "Resuelve esta ecuación matemática",
          type: "math",
          equation: "2x + 5 = 13",
          answer: 4
        }
      ],
      medium: [
        {
          question: "Descifra este código",
          type: "cipher",
          code: "3-15-4-9-7-15",
          answer: "CODIGO"
        }
      ],
      hard: [
        {
          question: "Resuelve este problema de lógica complejo",
          type: "logic",
          problem: "Sudoku 9x9",
          difficulty: "expert"
        }
      ]
    }
  };
  
  export const getDifficultyLevel = (difficulty) => {
    if (difficulty <= 5) return 'easy';
    if (difficulty <= 10) return 'medium';
    return 'hard';
  };
  
  export const getRandomQuestion = (suit, difficulty) => {
    const difficultyLevel = getDifficultyLevel(difficulty);
    const questions = gameQuestions[suit][difficultyLevel];
    return questions[Math.floor(Math.random() * questions.length)];
  };