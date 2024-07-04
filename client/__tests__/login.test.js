import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/loginscreen';
import { UserContext } from '../components/UserContext';

describe('Login Component', () => {
  it('should render login form', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ setUser: jest.fn() }}>
          <Login />
        </UserContext.Provider>
      </MemoryRouter>
    );
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should display error message on failed login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Failed to log in' }),
      })
    );

    render(
      <MemoryRouter>
        <UserContext.Provider value={{ setUser: jest.fn() }}>
          <Login />
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByText('Sign In'));

    const errorMessage = await screen.findByText('Failed to log in');
    expect(errorMessage).toBeInTheDocument();
  });
});
