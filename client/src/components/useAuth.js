// useAuth.js
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                refreshToken(token).then(newToken => {
                    localStorage.setItem('token', newToken);
                    setUser(jwtDecode(newToken));
                }).catch(err => {
                    console.error('Failed to refresh token', err);
                    localStorage.removeItem('token');
                });
            } else {
                setUser(decoded);
            }
        }
    }, []);

    const refreshToken = async (token) => {
        const response = await fetch('/api/auth/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        return data.token;
    };

    return { user, setUser };
};

export default useAuth;
