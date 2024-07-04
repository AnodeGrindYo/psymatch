import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../components/profile';
import { UserContext } from '../components/UserContext';

describe('Profile Component', () => {
  const user = {
    _id: '60d0fe4f5311236168a109ca',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    role: 'patient',
  };

  it('should render profile form', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user }}>
          <Profile />
        </UserContext.Provider>
      </MemoryRouter>
    );
    
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
  });
});
