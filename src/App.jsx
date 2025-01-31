// App.jsx
import { GameProvider } from './context/GameContext';
import GameManager from './components/game/GameManager';

const App = () => (
  <GameProvider>
    <GameManager />
  </GameProvider>
);

export default App;