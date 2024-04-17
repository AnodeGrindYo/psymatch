import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset message utilisateur

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.username, // email est l'username
                    password: formData.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to log in');
            }

            const result = await response.json();
            setMessage('Login successful! Redirecting...');
            console.log(result);

            // Rediriger ou manager la session utilisateur
        } catch (error) {
            setMessage(error.message);
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-500">
            <div className="text-center">
                <div className="mb-8">
                    <img src="psymatch-logo.png" alt="PsyMatch Logo" className="mx-auto h-48 w-auto" />
                </div>
                {!showForm && (
                    <button
                        className="bg-white text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1"
                        type="button"
                        onClick={handleToggleForm}
                    >
                        Connect
                    </button>
                )}
                {showForm && (
                    <>
                        <form className="mb-4" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-6">
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    className="bg-white text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1"
                                    type="submit"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                        {message && <p className="text-white">{message}</p>}
                        <p className="text-white">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-200 underline">
                                Register here
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;
