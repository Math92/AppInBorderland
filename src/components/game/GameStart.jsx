// GameStart.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import styles from './GameStart.module.css';
import UserDeck from '../UserDeck/UserDeck';
import AuthView from '../Auth/AuthView';

const GameStart = () => {
  const { state, selectCharacter, startGame } = useGame();
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeck, setShowDeck] = useState(() => {
    return localStorage.getItem('showDeck') === 'true'
  });
  const [userCardCount, setUserCardCount] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      
      // Calcular total de cartas obtenidas
      let count = 0;
      Object.values(userData.cards || {}).forEach(suit => {
        Object.values(suit).forEach(hasCard => {
          if (hasCard) count++;
        });
      });
      setUserCardCount(count);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('showDeck', showDeck);
  }, [showDeck]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('showDeck');
    setCurrentUser(null);
    window.location.reload();
  };

  if (!currentUser) {
    return <AuthView />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.userProfile}>
            <span className={styles.userEmail}>{currentUser.email}</span>
            <span className={styles.cardCount}>🎴 Cartas: {userCardCount}</span>
          </div>
          <div className={styles.actions}>
            <button 
              onClick={() => setShowDeck(!showDeck)} 
              className={styles.deckToggle}
            >
              {showDeck ? 'Ocultar Colección' : 'Ver Colección'}
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className={styles.mainCard}>
        {showDeck ? (
          <UserDeck onClose={() => setShowDeck(false)} />
        ) : (
          <>
            <h2 className={styles.title}>Selecciona tu personaje</h2>
            
            <div className={styles.grid}>
              {state.availableCharacters.map((character) => (
                <div
                  key={character.id}
                  onClick={() => selectCharacter(character)}
                  className={`${styles.characterCard} 
                    ${state.selectedCharacter?.id === character.id 
                      ? styles.selected 
                      : ''}`}
                >
                  <div className={styles.avatarContainer}>
                    <img 
                      src={character.avatar}
                      alt={`Avatar de ${character.name}`}
                      className={styles.avatar}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.characterInfo}>
                    <h3 className={styles.characterName}>{character.name}</h3>
                    <p className={styles.description}>{character.description}</p>
                    <span className={styles.ability}>
                      Habilidad: {character.specialAbility}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {state.selectedCharacter && (
              <div className={styles.startButtonWrapper}>
                <button
                  onClick={startGame}
                  className={styles.startButton}
                >
                  Comenzar Juego
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GameStart;