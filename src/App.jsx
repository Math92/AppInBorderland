import { GameProvider } from './context/GameContext.jsx';
import GameManager from './components/game/GameManager.jsx';

const App = () => {
  return (
    <GameProvider>
      <GameManager />
    </GameProvider>
  );
};

export default App;