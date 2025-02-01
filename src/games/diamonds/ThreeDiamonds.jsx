// ThreeDiamonds.jsx
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { DIAMOND_GAMES } from '../types.js';
import styles from './ThreeDiamonds.module.css';
import PlayingCard from '../../components/Card/PlayingCard';

const gameConfig = DIAMOND_GAMES.THREE;

const generateMaze = (size) => {
  // Crear grid vacío
  const maze = Array(size).fill().map(() => 
    Array(size).fill().map(() => ({
      walls: { top: true, right: true, bottom: true, left: true },
      visited: false
    }))
  );

  // Función para obtener celdas vecinas no visitadas
  const getUnvisitedNeighbors = (x, y) => {
    const neighbors = [];
    if (x > 0 && !maze[y][x-1].visited) neighbors.push({x: x-1, y, dir: 'left'});
    if (x < size-1 && !maze[y][x+1].visited) neighbors.push({x: x+1, y, dir: 'right'});
    if (y > 0 && !maze[y-1][x].visited) neighbors.push({x, y: y-1, dir: 'top'});
    if (y < size-1 && !maze[y+1][x].visited) neighbors.push({x, y: y+1, dir: 'bottom'});
    return neighbors;
  };

  // Generar camino usando DFS
  const carve = (x, y) => {
    maze[y][x].visited = true;
    
    let neighbors = getUnvisitedNeighbors(x, y);
    while (neighbors.length > 0) {
      const index = Math.floor(Math.random() * neighbors.length);
      const {x: nextX, y: nextY, dir} = neighbors[index];
      
      if (!maze[nextY][nextX].visited) {
        // Remover paredes entre celdas
        if (dir === 'left') {
          maze[y][x].walls.left = false;
          maze[nextY][nextX].walls.right = false;
        } else if (dir === 'right') {
          maze[y][x].walls.right = false;
          maze[nextY][nextX].walls.left = false;
        } else if (dir === 'top') {
          maze[y][x].walls.top = false;
          maze[nextY][nextX].walls.bottom = false;
        } else if (dir === 'bottom') {
          maze[y][x].walls.bottom = false;
          maze[nextY][nextX].walls.top = false;
        }
        carve(nextX, nextY);
      }
      neighbors = getUnvisitedNeighbors(x, y);
    }
  };

  // Iniciar desde la esquina superior izquierda
  carve(0, 0);
  return maze;
};

const ThreeDiamonds = () => {
  const { updateResults } = useGame();
  const [maze, setMaze] = useState(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(gameConfig.maxTime);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  // Inicializar juego
  useEffect(() => {
    const newMaze = generateMaze(gameConfig.mazeConfig.size);
    setMaze(newMaze);
    setPlayerPosition({ x: 0, y: 0 });
    setMoves(0);
  }, []);

  // Temporizador
  useEffect(() => {
    if (!isGameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameOver(true);
            updateResults({ score: 0, success: false });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isGameOver, timeLeft, updateResults]);

  const handleMove = (direction) => {
    if (isGameOver || !maze) return;

    const { x, y } = playerPosition;
    let newX = x;
    let newY = y;
    
    switch (direction) {
      case 'up':
        if (!maze[y][x].walls.top) newY--;
        break;
      case 'down':
        if (!maze[y][x].walls.bottom) newY++;
        break;
      case 'left':
        if (!maze[y][x].walls.left) newX--;
        break;
      case 'right':
        if (!maze[y][x].walls.right) newX++;
        break;
      default:
        break;
    }

    // Si la posición cambió
    if (newX !== x || newY !== y) {
      setPlayerPosition({ x: newX, y: newY });
      setMoves(prev => prev + 1);

      // Verificar si llegó al final
      if (newX === gameConfig.mazeConfig.size - 1 && 
          newY === gameConfig.mazeConfig.size - 1) {
        const timeBonus = timeLeft >= gameConfig.timeBonus.threshold ? 
          gameConfig.timeBonus.points : 0;
        const finalScore = gameConfig.baseScore + timeBonus;
        
        setScore(finalScore);
        setIsGameOver(true);
        updateResults({
          score: finalScore,
          success: true
        });
      }
    }
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowUp':
          handleMove('up');
          break;
        case 'ArrowDown':
          handleMove('down');
          break;
        case 'ArrowLeft':
          handleMove('left');
          break;
        case 'ArrowRight':
          handleMove('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [maze, playerPosition, isGameOver]);

  const renderMaze = () => {
    if (!maze) return null;

    return (
      <div className={styles.maze}>
        {maze.map((row, y) => (
          <div key={y} className={styles.row}>
            {row.map((cell, x) => (
              <div 
                key={`${x}-${y}`} 
                className={`${styles.cell} 
                  ${x === playerPosition.x && y === playerPosition.y ? styles.player : ''}
                  ${x === maze.length-1 && y === maze.length-1 ? styles.finish : ''}
                  ${x === 0 && y === 0 ? styles.start : ''}`}
                style={{
                  borderTop: cell.walls.top ? '2px solid #374151' : 'none',
                  borderRight: cell.walls.right ? '2px solid #374151' : 'none',
                  borderBottom: cell.walls.bottom ? '2px solid #374151' : 'none',
                  borderLeft: cell.walls.left ? '2px solid #374151' : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <PlayingCard cardId="3-diamonds" />
      <div className={styles.header}>
        ♦ {gameConfig.name} | Tiempo: {timeLeft}s | Movimientos: {moves}
      </div>

      <div className={styles.gameArea}>
        {renderMaze()}
        
        <div className={styles.controls}>
          <button 
            onClick={() => handleMove('up')} 
            className={styles.controlButton}
            disabled={isGameOver}
          >
            ↑
          </button>
          <div className={styles.horizontalControls}>
            <button 
              onClick={() => handleMove('left')} 
              className={styles.controlButton}
              disabled={isGameOver}
            >
              ←
            </button>
            <button 
              onClick={() => handleMove('right')} 
              className={styles.controlButton}
              disabled={isGameOver}
            >
              →
            </button>
          </div>
          <button 
            onClick={() => handleMove('down')} 
            className={styles.controlButton}
            disabled={isGameOver}
          >
            ↓
          </button>
        </div>

        {isGameOver && (
          <div className={styles.gameOver}>
            <h2>{score > 0 ? '¡Laberinto Completado!' : 'Tiempo Agotado'}</h2>
            <p>Puntuación: {score}</p>
            <p>Movimientos totales: {moves}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDiamonds;