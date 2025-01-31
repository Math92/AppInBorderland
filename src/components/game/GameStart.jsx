import { useGame } from '../../context/GameContext';
import styles from './GameStart.module.css';

const GameStart = () => {
 const { state, selectCharacter, startGame } = useGame();

 return (
   <div className={styles.container}>
     <div className={styles.mainCard}>
       <h2 className={styles.title}>Selecciona tu personaje</h2>
       
       <div className={styles.grid}>
         {state.availableCharacters.map((character) => (
           <div
             key={character.id}
             onClick={() => selectCharacter(character)}
             className={`${styles.characterCard} 
               ${state.selectedCharacter?.id === character.id 
                 ? styles.selected 
                 : styles.unselected}`}
           >
             <h3 className={styles.characterName}>{character.name}</h3>
             <p className={styles.description}>{character.description}</p>
             <p className={styles.ability}>
               Habilidad: {character.specialAbility}
             </p>
           </div>
         ))}
       </div>

       {state.selectedCharacter && (
         <div className={styles.startButtonWrapper}>
           <button
             onClick={startGame}
             className={styles.startButton}>
             Comenzar Juego
           </button>
         </div>
       )}
     </div>
   </div>
 );
};

export default GameStart;