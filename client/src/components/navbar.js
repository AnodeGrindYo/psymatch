import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-bold">PsyMatch</Link>
        <button onClick={toggleMenu} className="focus:outline-none">
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} w-6 h-6`}></i>
        </button>
      </div>
      <div className={`w-full ${menuOpen ? 'block' : 'hidden'}`}>
        <Link to="/matcher" className="block p-4 hover:bg-blue-600">Matcher</Link>
        <Link to="/matches" className="block p-4 hover:bg-blue-600">Matchs</Link>
        <Link to="/profile" className="block p-4 hover:bg-blue-600">Profil</Link>
        <button className="block p-4 hover:bg-blue-600" onClick={() => console.log('Logout')}>Déconnexion</button>
      </div>
    </nav>
  );
};

export default Navbar;
