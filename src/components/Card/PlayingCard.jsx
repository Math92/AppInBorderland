// PlayingCard.jsx
import PropTypes from 'prop-types';
import styles from './PlayingCard.module.css';
import { useEffect, useState } from 'react';



const formatCardId = (cardId) => {
  // Añadir valor por defecto y validación
  if (typeof cardId !== 'string') return '00';
  const [rank, suit] = cardId.toLowerCase().split('-');
  const rankMap = {
    'a': 'A',
    'ace': 'A',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10':'0',
    'ten': '0',
    'four': '4',
    'j': 'J',
    'q': 'Q',
    'k': 'K'
  };

  const suitMap = {
    'spades': 'S',
    'hearts': 'H',
    'diamonds': 'D',
    'clubs': 'C'
  };

  // Validar componentes
  const formattedRank = rank ? (rankMap[rank] || rank.toUpperCase()) : '0';
  const formattedSuit = suit ? (suitMap[suit] || suit[0]?.toUpperCase() || '0') : '0';

  return `${formattedRank}${formattedSuit}`;
};

const PlayingCard = ({ 
  cardId, 
  size = 'medium'
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const cardCode = formatCardId(cardId);
  
  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = `https://deckofcardsapi.com/static/img/${cardCode}.png`;
        const response = await fetch(url);
        if (response.ok) {
          setImageSrc(url);
        } else {
          setImageSrc('https://deckofcardsapi.com/static/img/back.png');
        }
      } catch (error) {
        console.error('Error loading card:', error);
        setImageSrc('https://deckofcardsapi.com/static/img/back.png');
      }
    };
    
    loadImage();
  }, [cardCode]);
  
  if (!imageSrc) {
    return <div className={`${styles.cardContainer} ${styles[size]}`}>Loading...</div>;
  }
  
  return (
    <div className={`${styles.cardContainer} ${styles[size]}`}>
      <img
        src={imageSrc}
        alt={`Carta ${cardId}`}
        className={styles.cardImage}
      />
    </div>
  );
};
PlayingCard.propTypes = {
  cardId: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default PlayingCard;