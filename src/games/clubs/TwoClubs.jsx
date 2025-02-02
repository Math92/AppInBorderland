// TwoClubs.jsx
import { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import PlayingCard from '../../components/Card/PlayingCard';
import TeamManager from './TeamManager';
import { CLUB_GAMES } from '../types';
import styles from './TwoClubs.module.css';

const TwoClubs = () => {
  const { updateResults } = useGame();
  const [playerChoices, setPlayerChoices] = useState([]);
  const [npcChoices, setNpcChoices] = useState([]);
  const [revealedNPCChoices, setRevealedNPCChoices] = useState([]);
  const [gameState, setGameState] = useState('PREPARING');
  const [gameResult, setGameResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const gameConfig = CLUB_GAMES.TWO || {
    id: '2-clubs',
    name: 'Doble Coordinación',
    teamSize: 2,
    baseScore: 150
  };

  const colors = ['#FF6B6B', '#4D96FF', '#6BCB77'];

  const handleTeamFormed = useCallback(() => {
    setGameState('PLAYING');
  }, []);

  const handlePlayerChoice = (color) => {
    if (gameState !== 'PLAYING' || playerChoices.length >= 2) return;

    const newPlayerChoices = [...playerChoices, color];
    setPlayerChoices(newPlayerChoices);

    setTimeout(() => {
      const npcColor = colors[Math.floor(Math.random() * colors.length)];
      const newNpcChoices = [...npcChoices, npcColor];
      
      setNpcChoices(newNpcChoices);
      setRevealedNPCChoices(prev => [...prev, npcColor]);

      if (newPlayerChoices.length === 2) {
        setTimeout(() => {
          const result = JSON.stringify(newPlayerChoices) === JSON.stringify(newNpcChoices);
          setGameResult(result);
          setGameState('FINISHED');
          updateResults({
            score: result ? gameConfig.baseScore : 0,
            success: result
          });
        }, 1500); // Aumentamos el tiempo para mejor visualización
      } else {
        setCurrentStep(1);
      }
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <PlayingCard cardId={gameConfig.id} />
      <div className={styles.header}>
        ♣ {gameConfig.name}
      </div>

      <TeamManager teamSize={gameConfig.teamSize} onTeamFormed={handleTeamFormed}>
        {(team) => (
          <div className={styles.gameArea}>
            <div className={styles.gameInfo}>
              <h3>¡Doble Coordinación!</h3>
              <p>Selecciona 2 colores en orden que coincidan con tu compañero</p>
            </div>

            <div className={styles.teamArea}>
              {team.map((player, index) => (
                <div key={player.id} className={styles.player}>
                  <img src={player.avatar} alt={player.name} className={styles.avatar} />
                  <div className={styles.playerName}>
                    {player.name} {index === 0 && '(Tú)'}
                  </div>
                  <div className={styles.choicesContainer}>
                    {index === 0 && playerChoices.map((choice, i) => (
                      <div key={i} className={styles.doubleChoiceIndicator} 
                        style={{ backgroundColor: choice }}>
                        {revealedNPCChoices[i] && (
                          <span className={styles.checkmark}>
                            {choice === npcChoices[i] ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    ))}
                    {index === 1 && npcChoices.map((choice, i) => (
                      <div key={i} className={styles.doubleChoiceIndicator} 
                        style={{ 
                          backgroundColor: revealedNPCChoices[i] ? choice : 'transparent',
                          border: revealedNPCChoices[i] ? 'none' : '2px dashed #666',
                          transition: 'all 0.5s ease'
                        }}>
                        {revealedNPCChoices[i] && playerChoices[i] && (
                          <span className={styles.checkmark}>
                            {choice === playerChoices[i] ? '✓' : '✗'}
                          </span>
                        )}
                        {!revealedNPCChoices[i] && <span className={styles.questionMark}>?</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {gameState === 'PLAYING' && (
              <div className={styles.colorSelection}>
                <h3>Tu turno: Selecciona 2 colores ({2 - playerChoices.length} restantes)</h3>
                <div className={styles.colorButtons}>
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`${styles.colorButton} 
                        ${playerChoices.includes(color) ? styles.selected : ''}
                        ${currentStep === playerChoices.length ? styles.activeStep : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handlePlayerChoice(color)}
                      disabled={playerChoices.length >= 2}
                    />
                  ))}
                </div>
              </div>
            )}

            {gameState === 'FINISHED' && (
              <div className={styles.results}>
                <h3>{gameResult ? '¡Doble Acierto!' : '¡Coordinación Fallida!'}</h3>
                <div className={gameResult ? styles.success : styles.failure}>
                  <div className={styles.finalChoices}>
                    <div className={styles.choiceComparison}>
                      <p>Tus elecciones:</p>
                      <div className={styles.choiceDisplay}>
                        {playerChoices.map((color, i) => (
                          <div key={i} className={styles.colorResult} 
                            style={{ backgroundColor: color }}>
                            {npcChoices[i] === color ? '✓' : '✗'}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.choiceComparison}>
                      <p>Elecciones del compañero:</p>
                      <div className={styles.choiceDisplay}>
                        {npcChoices.map((color, i) => (
                          <div key={i} className={styles.colorResult} 
                            style={{ backgroundColor: color }}>
                            {playerChoices[i] === color ? '✓' : '✗'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.resultDetails}>
                    {gameResult ? (
                      <p>¡Coincidencia perfecta en ambos colores!</p>
                    ) : (
                      <p>Coincidencias: {
                        npcChoices.reduce((acc, color, i) => 
                          acc + (color === playerChoices[i] ? 1 : 0), 0)
                      }/2</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </TeamManager>
    </div>
  );
};

export default TwoClubs;