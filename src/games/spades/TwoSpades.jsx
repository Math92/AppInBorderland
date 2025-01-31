// TwoSpades.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { SPADE_GAMES } from '../../data/types';
import styles from './TwoSpades.module.css';

const TwoSpades = () => {
 const { updateRoundResults } = useGame();
 const gameConfig = SPADE_GAMES.TWO;
 
 const [power, setPower] = useState(0);
 const [isHolding, setIsHolding] = useState(false);
 const [timeLeft, setTimeLeft] = useState(15);
 const [maxPower, setMaxPower] = useState(0);
 const [isFinished, setIsFinished] = useState(false);

 useEffect(() => {
   const timer = setInterval(() => {
     setTimeLeft(prev => {
       if (prev <= 0) {
         setIsFinished(true);
         updateRoundResults({
           score: maxPower,
           success: maxPower >= gameConfig.minPower 
         });
         return 0;
       }
       return prev - 1;
     });
   }, 1000);
   return () => clearInterval(timer);
 }, []);

 useEffect(() => {
   let powerInterval;
   if (isHolding && power < 100 && !isFinished) {
     powerInterval = setInterval(() => {
       setPower(current => {
         const newPower = Math.min(current + 2, 100);
         setMaxPower(Math.max(maxPower, newPower));
         return newPower;
       });
     }, 100);
   } else if (!isHolding && power > 0) {
     powerInterval = setInterval(() => {
       setPower(prev => Math.max(prev - 4, 0));
     }, 100);
   }
   return () => clearInterval(powerInterval);
 }, [isHolding, power, isFinished]);

 return (
   <div className={styles.container}>
     <div className={styles.header}>
       {gameConfig.name} | Tiempo: {timeLeft}s | Máximo: {maxPower}%
     </div>

     {!isFinished ? (
       <div className={styles.gameArea}>
         <div className={styles.powerBar}>
           <div 
             className={`${styles.powerIndicator} ${styles[`power${Math.floor(power/25)}`]}`}
             style={{ width: `${power}%` }}
           />
         </div>

         <button
           onMouseDown={() => setIsHolding(true)}
           onMouseUp={() => setIsHolding(false)}
           onMouseLeave={() => setIsHolding(false)}
           className={`${styles.holdButton} ${isHolding ? styles.holding : ''}`}
         >
           {isHolding ? '¡MANTÉN!' : 'PRESIONA'}
         </button>
       </div>
     ) : (
       <div className={styles.results}>
         <h2>{maxPower >= gameConfig.minPower ? '¡Victoria!' : 'Derrota'}</h2>
         <p>Poder máximo: {maxPower}%</p>
         <p>Objetivo: {gameConfig.minPower}%</p>
       </div>
     )}
   </div>
 );
};

export default TwoSpades;