// App.jsx
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import GameManager from './components/game/GameManager';
import PruebasAdmin from './pruebas/PruebasAdmin';

const App = () => {
  return (
    <GameProvider>
      <Router>
        <div className="app-container">
          <Switch>
            <Route exact path="/" component={GameManager} />
            <Route path="/pruebas" component={PruebasAdmin} />
          </Switch>
        </div>
      </Router>
    </GameProvider>
  );
};

export default App;