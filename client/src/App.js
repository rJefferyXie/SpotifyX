import './App.css';

import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return (
    code ? <Dashboard code={code}></Dashboard> : <Login></Login>
  );
}

export default App;
