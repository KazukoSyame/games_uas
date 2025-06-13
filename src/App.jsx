import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CharacterSelectPage from './pages/CharacterSelectPage';
import HomePage from './pages/HomePage';
import Inventory from './Inventory';
import LoginPage from './pages/LoginPages';

function App() {
  return (
    <Router>
      <Routes>
        {/*}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<CharacterSelectPage />} />
        <Route path="/home" element={<HomePage />} />
        */}
        
        {/* Set LoginPage as the default route */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/character-select" element={<CharacterSelectPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;