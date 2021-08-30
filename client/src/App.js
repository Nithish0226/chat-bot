
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import Auth from './Auth';

function App() {
  return (
    <div>
    
      <Router>
        <Route path="/" exact>
        <Auth/>
        </Route> 
        <Route path="/home" exact>
        <Home/>
        </Route> 
      </Router>

    </div>
  );
}

export default App;
