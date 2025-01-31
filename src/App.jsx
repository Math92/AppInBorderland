// App.jsx
import { GameProvider } from './context/GameContext';
import GameManager from './components/game/GameManager';

const App = () => {
  return (
    <GameProvider>
      <div className="app-container">
        <GameManager />
      </div>
    </GameProvider>
  );
};

export default App;