// charactersData.js
import arisuImage from '/src/assets/public/images/arisu.png';
import usagiImage from '/src/assets/public/images/usagi.png';
import chishiyaImage from '/src/assets/public/images/chishiya.png';
import kuinaImage from '/src/assets/public/images/kuina.png';
import annImage from '/src/assets/public/images/ann.png';
import aguniImage from '/src/assets/public/images/aguni.png';
import tattaImage from '/src/assets/public/images/tatta.png';

export const characters = [
  {
    id: 1,
    name: "Arisu",
    description: "Experto en lógica y estrategia",
    specialAbility: "Bonus en juegos de ♠",
    avatar: arisuImage, // Usa la variable importada
    image: 'https://via.placeholder.com/150/92c952'
  },
  {
    id: 2,
    name: "Usagi", 
    description: "Atleta profesional",
    specialAbility: "Bonus en juegos de ♥",
    avatar: usagiImage,
    image: 'https://via.placeholder.com/150/771796'
  },
  {
    id: 3,
    name: "Chishiya",
    description: "Maestro de la manipulación",
    specialAbility: "Bonus en juegos de ♦",
    avatar: chishiyaImage,
    image: 'https://via.placeholder.com/150/24f355'
  },
  {
    id: 4,
    name: "Kuina",
    description: "Experta en combate",
    specialAbility: "Bonus en juegos físicos",
    avatar: kuinaImage,
    image: 'https://via.placeholder.com/150/d32776'
  },
  {
    id: 5,
    name: "Ann",
    description: "Médica inteligente",
    specialAbility: "Bonus en juegos de estrategia",
    avatar: annImage,
    image: 'https://via.placeholder.com/150/f66b97'
  },
  {
    id: 6,
    name: "Aguni",
    description: "Lider de grupo",
    specialAbility: "Bonus en juegos de ♣",
    avatar: aguniImage,
    image: 'https://via.placeholder.com/150/56a8c2'
  },
  {
    id: 7,
    name: "Tatta",
    description: "Colaborador Innato",
    specialAbility: "Bonus en juegos psicológicos",
    avatar: tattaImage,
    image: 'https://via.placeholder.com/150/b0f7cc'
  }
];