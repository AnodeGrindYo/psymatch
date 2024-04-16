// Desc: Main entry point for the react app
import './App.css';
// import Component from './components/loginscreen';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/loginscreen';
import Register from './components/registerscreen';

function App() {
  return (
    // <Component/>
    <Router>
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

      </Routes>
    </Router>
  );
}

export default App;
