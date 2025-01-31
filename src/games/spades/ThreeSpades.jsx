// ThreeSpades.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { SPADE_GAMES } from '../../data/types';
import styles from './ThreeSpades.module.css';

const ThreeSpades = () => {
 const { updateRoundResults } = useGame();
 const gameConfig = SPADE_GAMES.THREE;
 
 const [timeLeft, setTimeLeft] = useState(15);
 const [score, setScore] = useState(0);
 const [currentCombo, setCurrentCombo] = useState([]);
 const [targetCombo, setTargetCombo] = useState([]);
 const [isFinished, setIsFinished] = useState(false);

 const buttons = ['↑', '↓', '←', '→'];
 const comboLength = 4;
 
 const generateCombo = () => {
   const newCombo = Array(comboLength).fill()
     .map(() => buttons[Math.floor(Math.random() * buttons.length)]);
   setTargetCombo(newCombo);
   setCurrentCombo([]);
 };

 useEffect(() => {
   generateCombo();
   const timer = setInterval(() => {
     setTimeLeft(prev => {
       if (prev <= 0) {
         setIsFinished(true);
         updateRoundResults({
           score,
           success: score >= gameConfig.minCombos
         });
         return 0;
       }
       return prev - 1;
     });
   }, 1000);
   return () => clearInterval(timer);
 }, []);

 const handleButton = (button) => {
   if (isFinished) return;
   
   const newCombo = [...currentCombo, button];
   setCurrentCombo(newCombo);

   if (newCombo[newCombo.length - 1] !== targetCombo[newCombo.length - 1]) {
     setTimeout(setCurrentCombo, 200, []);
     return;
   }

   if (newCombo.length === targetCombo.length) {
     setScore(prev => prev + 1);
     setTimeout(generateCombo, 500);
   }
 };

 return (
   <div className={styles.container}>
     <div className={styles.header}>
       {gameConfig.name} | Tiempo: {timeLeft}s | Combos: {score}/{gameConfig.minCombos}
     </div>

     {!isFinished ? (
       <div className={styles.gameArea}>
         <div className={styles.comboDisplay}>
           <div className={styles.comboRow}>
             {targetCombo.map((button, i) => (
               <div key={i} className={styles.comboButton}>{button}</div>
             ))}
           </div>
           <div className={styles.comboRow}>
             {targetCombo.map((_, i) => (
               <div key={i} className={`
                 ${styles.comboButton}
                 ${currentCombo[i] === targetCombo[i] ? styles.correct : ''}
                 ${currentCombo[i] && currentCombo[i] !== targetCombo[i] ? styles.wrong : ''}
               `}>
                 {currentCombo[i] || '?'}
               </div>
             ))}
           </div>
         </div>

         <div className={styles.controls}>
           <button onClick={() => handleButton('↑')} className={styles.arrow}>↑</button>
           <div className={styles.middleRow}>
             <button onClick={() => handleButton('←')} className={styles.arrow}>←</button>
             <div className={styles.center} />
             <button onClick={() => handleButton('→')} className={styles.arrow}>→</button>
           </div>
           <button onClick={() => handleButton('↓')} className={styles.arrow}>↓</button>
         </div>
       </div>
     ) : (
       <div className={styles.results}>
         <h2>{score >= gameConfig.minCombos ? '¡Victoria!' : 'Derrota'}</h2>
         <p>Combos completados: {score}</p>
         <p>Objetivo: {gameConfig.minCombos}</p>
       </div>
     )}
   </div>
 );
};

export default ThreeSpades;