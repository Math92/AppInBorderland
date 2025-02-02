// AceClubs.jsx
import { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import PlayingCard from '../../components/Card/PlayingCard';
import TeamManager from './TeamManager';
import { CLUB_GAMES } from '../types';
import styles from './AceClubs.module.css';

const AceClubs = () => {
  const { updateResults } = useGame();
  const [playerChoice, setPlayerChoice] = useState(null);
  const [npcChoice, setNpcChoice] = useState(null);
  const [gameState, setGameState] = useState('PREPARING');
  const [gameResult, setGameResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const gameConfig = CLUB_GAMES.ACE || {
    id: 'A-clubs',
    name: 'Coordinación de Colores',
    teamSize: 2,
    baseScore: 100
  };

  const colors = ['#FF6B6B', '#4D96FF', '#6BCB77'];

  const handleTeamFormed = useCallback(() => {
    setGameState('PLAYING');
  }, []);

  const handlePlayerChoice = (color) => {
    if (gameState !== 'PLAYING' || playerChoice) return;
    
    setPlayerChoice(color);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * colors.length);
      const npcSelected = colors[randomIndex];
      setNpcChoice(npcSelected);
      
      // Mostrar elección del NPC primero
      setTimeout(() => {
        const result = color === npcSelected;
        setGameResult(result);
        setShowResult(true);
        updateResults({
          score: result ? gameConfig.baseScore : 0,
          success: result
        });
      }, 1000); // Tiempo adicional para ver la jugada del NPC
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
              <h3>¡Coordinación de Equipo!</h3>
              <p>Selecciona el mismo color que tu compañero</p>
            </div>

            <div className={styles.teamArea}>
              {team.map((player, index) => (
                <div key={player.id} className={styles.player}>
                  <img src={player.avatar} alt={player.name} className={styles.avatar} />
                  <div className={styles.playerName}>
                    {player.name} {index === 0 && '(Tú)'}
                  </div>
                  <div className={styles.choicesContainer}>
                    {index === 0 && playerChoice && (
                      <div className={styles.choiceIndicator} style={{ backgroundColor: playerChoice }}>
                        {npcChoice && (
                          <span className={styles.checkmark}>
                            {playerChoice === npcChoice ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    )}
                    {index === 1 && npcChoice && (
                      <div className={styles.choiceIndicator} style={{ backgroundColor: npcChoice }}>
                        {playerChoice && (
                          <span className={styles.checkmark}>
                            {npcChoice === playerChoice ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {gameState === 'PLAYING' && (
              <div className={styles.colorSelection}>
                <h3>Tu turno: Selecciona un color</h3>
                <div className={styles.colorButtons}>
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`${styles.colorButton} ${playerChoice === color ? styles.selected : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handlePlayerChoice(color)}
                      disabled={!!playerChoice}
                    />
                  ))}
                </div>
              </div>
            )}

            {showResult && (
              <div className={styles.results}>
                <h3>{gameResult ? '¡Éxito en equipo!' : '¡Fallaron la coordinación!'}</h3>
                <div className={gameResult ? styles.success : styles.failure}>
                  <div className={styles.finalChoices}>
                    <div className={styles.choiceWithLabel}>
                      <p>Tu elección:</p>
                      <div 
                        className={styles.colorResult} 
                        style={{ backgroundColor: playerChoice }}
                      >
                        {gameResult ? '✓' : '✗'}
                      </div>
                      <span className={styles.colorHex}>{playerChoice}</span>
                    </div>
                    <div className={styles.choiceWithLabel}>
                      <p>Elección del compañero:</p>
                      <div 
                        className={styles.colorResult} 
                        style={{ backgroundColor: npcChoice }}
                      >
                        {gameResult ? '✓' : '✗'}
                      </div>
                      <span className={styles.colorHex}>{npcChoice}</span>
                    </div>
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

export default AceClubs;