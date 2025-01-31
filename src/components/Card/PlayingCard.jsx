// components/Card/PlayingCard.jsx
import PropTypes from 'prop-types';
import styles from './PlayingCard.module.css';

const cardMap = {
  'A-spades': 'AS',
  '2-spades': '2S',
  '3-spades': '3S',
  // Podemos agregar más cartas según se necesiten
};

const PlayingCard = ({ cardId }) => {
  const cardCode = cardMap[cardId];
  
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