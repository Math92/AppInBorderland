import { useGame } from '../../context/GameContext';
import styles from './GameManager.module.css';
import GameStart from './GameStart';
import AceSpades from '../../games/spades/AceSpades';
import TwoSpades from '../../games/spades/TwoSpades';
import ThreeSpades from '../../games/spades/ThreeSpades';

const GameManager = () => {
 const { state } = useGame();

 const renderCurrentGame = () => {
   if (!state.currentCard) return null;

   const gameMap = {
     'A-spades': AceSpades,
     '2-spades': TwoSpades,
     '3-spades': ThreeSpades
   };

   const GameComponent = gameMap[state.currentCard.id];
   
   return GameComponent ? <GameComponent /> : (
     <div className={styles.unavailableGame}>Juego no disponible</div>
   );
 };

 const renderResults = () => (
   <div className={styles.resultsCard}>
     <h2 className={styles.title}>Resultados</h2>
     {state.currentGameResults && (
       <div className={styles.resultItem}>
         <p className={state.currentGameResults.success ? styles.success : styles.failure}>
           {state.currentGameResults.success ? '¡Victoria!' : 'Derrota'}
         </p>
         <p>Puntuación: {state.currentGameResults.score}</p>
       </div>
     )}
   </div>
 );

 return (
   <div className={styles.container}>
     <div className={styles.gameCard}>
       {state.gameState === 'CHARACTER_SELECTION' && <GameStart />}
       {state.gameState === 'PLAYING' && renderCurrentGame()}
       {state.gameState === 'FINISHED' && renderResults()}
     </div>
   </div>
 );
};

export default GameManager;
