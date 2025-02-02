// PlayingCard.jsx
import PropTypes from 'prop-types';
import styles from './PlayingCard.module.css';

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
    '10':'10',
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
  size = 'medium'  // Usando parámetro por defecto en lugar de defaultProps
}) => {
  const cardCode = formatCardId(cardId);
  
  return (
    <div className={`${styles.cardContainer} ${styles[size]}`}>
      <img
        src={`/cards/${cardCode}.png`}
        alt={`Carta ${cardId}`}
        className={styles.cardImage}
        onError={(e) => {
          e.target.onerror = null;
          // Intentar con API externa como fallback
          e.target.src = `https://deckofcardsapi.com/static/img/${cardCode}.png`;
        }}
      />
    </div>
  );
};

PlayingCard.propTypes = {
  cardId: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

// Eliminamos esta parte:
// PlayingCard.defaultProps = {
//   size: 'medium'
// };

export default PlayingCard;