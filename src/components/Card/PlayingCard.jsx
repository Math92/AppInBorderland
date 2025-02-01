// components/Card/PlayingCard.jsx
import PropTypes from 'prop-types';
import styles from './PlayingCard.module.css';

const cardMap = {
  'A-spades': 'AS',
  '2-spades': '2S',
  '3-spades': '3S',
  'four-spades': '4S',
  'A-hearts': 'AH',
  'ace-hearts': 'AH'
};

const PlayingCard = ({ cardId }) => {
  // Convertimos el ID a minúsculas para hacer la comparación más robusta
  const normalizedId = cardId.toLowerCase();
  const cardCode = cardMap[normalizedId] || cardMap[cardId];
  
  if (!cardCode) {
    console.warn(`Card not found for id: ${cardId}`);
    return null;
  }
  
  return (
    <div className={styles.cardContainer}>
      <img
        src={`https://deckofcardsapi.com/static/img/${cardCode}.png`}
        alt={`Carta ${cardId}`}
        className={styles.cardImage}
      />
    </div>
  );
};

PlayingCard.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default PlayingCard;