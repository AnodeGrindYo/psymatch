// src/components/Navbar.js
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto">
        <div className="flex justify-between">
          <a href="/" className="text-lg font-bold">PsyMatch</a>
          {/* ...autres éléments de navigation... */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
