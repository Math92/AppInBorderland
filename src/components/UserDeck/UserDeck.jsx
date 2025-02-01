// UserDeck.jsx
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { db } from '../../firebase';
import styles from './UserDeck.module.css';
import PlayingCard from '../Card/PlayingCard';

const UserDeck = ({ onClose = () => console.warn('onClose prop not provided to UserDeck') }) => {
  const [userCards, setUserCards] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const translateSuit = (suit) => {
    const translations = {
      'hearts': 'Corazones',
      'spades': 'Picas',
      'diamonds': 'Diamantes',
      'clubs': 'Tréboles'
    };
    return translations[suit] || suit;
  };

  useEffect(() => {
    const loadUserCards = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser?.id) {
          setError('Usuario no encontrado');
          return;
        }

        const userDoc = await db.collection('users').doc(currentUser.id).get();
        if (!userDoc) {
          setError('No se encontraron las cartas del usuario');
          return;
        }

        setUserCards(userDoc.cards || {
          clubs: {},
          diamonds: {},
          hearts: {},
          spades: {}
        });
      } catch (err) {
        console.error('Error cargando cartas:', err);
        setError('Error cargando las cartas. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCards();

    return () => {
      setUserCards(null);
      setError(null);
      setIsLoading(true);
    };
  }, []);

  const getCollectionStats = () => {
    if (!userCards) return { total: 0, obtained: 0, percentage: 0 };

    let total = 0;
    let obtained = 0;

    suits.forEach(suit => {
      ranks.forEach(rank => {
        total++;
        if (userCards[suit]?.[rank]) obtained++;
      });
    });

    return {
      total,
      obtained,
      percentage: Math.round((obtained / total) * 100)
    };
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Cargando tu colección...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <div className={styles.errorActions}>
          <button onClick={onClose} className={styles.closeButton}>
            Volver al Juego
          </button>
        </div>
      </div>
    );
  }

  if (!userCards) return null;

  const stats = getCollectionStats();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tu Colección de Cartas</h2>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Cartas Obtenidas:</span>
            <span className={styles.statValue}>{stats.obtained}/{stats.total}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Progreso:</span>
            <span className={styles.statValue}>{stats.percentage}%</span>
          </div>
        </div>
      </div>
      
      <div className={styles.decks}>
        {suits.map(suit => (
          <div key={suit} className={styles.suitSection}>
            <h3 className={styles.suitTitle}>
              {translateSuit(suit)}
              <span className={styles.suitIcon}>
                {suit === 'hearts' ? '♥️' : 
                 suit === 'spades' ? '♠️' : 
                 suit === 'diamonds' ? '♦️' : '♣️'}
              </span>
            </h3>
            <div className={styles.cardGrid}>
              {ranks.map(rank => {
                const hasCard = userCards[suit]?.[rank];
                return (
                  <div 
                    key={`${rank}-${suit}`}
                    className={`${styles.cardWrapper} ${hasCard ? styles.obtained : styles.locked}`}
                    title={hasCard ? `${rank} de ${translateSuit(suit)}` : 'Carta bloqueada'}
                  >
                    {hasCard ? (
                      <PlayingCard cardId={`${rank}-${suit}`} />
                    ) : (
                      <div className={styles.lockedCard}>
                        <span className={styles.lockIcon}>🔒</span>
                        <span className={styles.cardRank}>{rank}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button 
          onClick={onClose} 
          className={styles.closeButton}
          title="Volver a la selección de personaje"
        >
          Volver al Juego
        </button>
      </div>
    </div>
  );
};

UserDeck.propTypes = {
  onClose: PropTypes.func
};

export default UserDeck;