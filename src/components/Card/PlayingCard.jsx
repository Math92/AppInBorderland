// PlayingCard.jsx
import PropTypes from 'prop-types';
import styles from './PlayingCard.module.css';

const formatCardId = (cardId) => {
  const [rank, suit] = cardId.toLowerCase().split('-');
  const rankMap = {
    'a': 'A',
    'ace': 'A',
    '2': '2',
    '3': '3',
    '4': '4',
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

  const formattedRank = rankMap[rank] || rank.toUpperCase();
  const formattedSuit = suitMap[suit] || suit[0].toUpperCase();

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