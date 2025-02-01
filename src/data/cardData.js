export const suits = {
    hearts: {
      symbol: '♥',
      type: 'PHYSICAL',
      description: 'Juegos de psicologia y habilidades emocionales'
    },
    diamonds: {
      symbol: '♦',
      type: 'INTELLIGENCE',
      description: 'Juegos de astucia y manipulación'
    },
    clubs: {
      symbol: '♣',
      type: 'TEAMWORK',
      description: 'Juegos de trabajo en equipo'
    },
    spades: {
      symbol: '♠',
      type: 'FORCE',
      description: 'Juegos de destreza fisica'
    }
  };
  
  export const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  export const calculateDifficulty = (rank) => {
    if (rank === '2') return 2;
    if (rank === '3') return 3;
    if (rank === '4') return 4;
    if (rank === '5') return 5;
    if (rank === '6') return 6;
    if (rank === '7') return 7;
    if (rank === '9') return 9;
    if (rank === '10') return 10;
    if (rank === 'A') return 1;
    if (rank === 'J') return 11;
    if (rank === 'Q') return 12;
    if (rank === 'K') return 13;
    return parseInt(rank);
  };