import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/loginscreen';
import Register from './components/registerscreen';
import Main from './components/main';
import Profile from './components/profile';
import SwipeDeck from './components/SwipeDeck';
import VideoCall from './components/VideoCall';
import { UserProvider } from './components/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<Main />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/matcher" element={<SwipeDeck />} />
          <Route path="/video/:sessionId" element={<VideoCall />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
