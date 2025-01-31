// RoundResults.jsx
import PropTypes from 'prop-types';
import styles from './RoundResults.module.css';

// Componente para mostrar resultados de ronda 
const RoundResults = ({ playerResult, mainCharacters = [], npcResults = [], onNextRound }) => {
 const npcWinners = npcResults.filter(player => player?.success).length;

 return (
   <div className={styles.container}>
     <div className={styles.card}>
       <h2 className={styles.title}>Resultados de la Partida</h2>

       {/* Resultado del jugador */}
       {playerResult && (
         <div className={styles.playerCard}>
           <h3>Tu resultado:</h3>
           <div className={playerResult.success ? styles.success : styles.failure}>
             {playerResult.success ? '¡Victoria!' : 'Derrota'}
           </div>
           <div>Puntuación: {playerResult.score}</div>
         </div>
       )}

       {/* Resultados de NPCs principales */}
       {mainCharacters.length > 0 && (
         <div className={styles.section}>
           <h3>Personajes Principales:</h3>
           <div className={styles.grid}>
             {mainCharacters.map(char => (
               <div key={char.id} className={styles.characterCard}>
                 <div className={styles.name}>{char.name}</div>
                 <div className={char.success ? styles.success : styles.failure}>
                   {char.success ? 'Victoria' : 'Derrota'}
                 </div>
                 <div>Puntuación: {char.score}</div>
               </div>
             ))}
           </div>
         </div>
       )}

       {/* Resumen general */}
       {npcResults.length > 0 && (
         <div className={styles.summaryCard}>
           <h3>Otros Jugadores:</h3>
           <div>{npcWinners} de {npcResults.length} superaron la prueba</div>
         </div>
       )}

       <button onClick={onNextRound} className={styles.button}>
         Continuar
       </button>
     </div>
   </div>
 );
};

RoundResults.propTypes = {
 playerResult: PropTypes.shape({
   success: PropTypes.bool.isRequired,
   score: PropTypes.number.isRequired
 }),
 mainCharacters: PropTypes.arrayOf(
   PropTypes.shape({
     id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
     name: PropTypes.string.isRequired,
     success: PropTypes.bool.isRequired,
     score: PropTypes.number.isRequired
   })
 ),
 npcResults: PropTypes.arrayOf(
   PropTypes.shape({
     success: PropTypes.bool.isRequired,
     score: PropTypes.number.isRequired
   })
 ),
 onNextRound: PropTypes.func.isRequired
};

export default RoundResults;