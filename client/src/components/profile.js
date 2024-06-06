import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        preferredLanguage: '',
        issues: [],
        locationPreference: '',
        languages: [],
        specialization: [],
        bio: '',
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                console.log('No user found in context');
                return;
            }

            try {
                const response = await fetch(`/api/auth/getCurrentUser/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setFormData(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch(`/api/auth/updateUser/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setMessage('Profile updated successfully');
        } catch (error) {
            setMessage(error.message);
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>; // Afficher un indicateur de chargement si l'utilisateur n'est pas encore chargé
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-500">
            <div className="p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-blue-500 mb-6">Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            onChange={handleInputChange}
                            value={formData.firstName}
                            required
                            className="w-full p-4 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            onChange={handleInputChange}
                            value={formData.lastName}
                            required
                            className="w-full p-4 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleInputChange}
                            value={formData.email}
                            required
                            className="w-full p-4 border rounded"
                            disabled
                        />
                    </div>

                    {user.role === 'patient' && (
                        <>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="preferredLanguage"
                                    placeholder="Preferred Language"
                                    onChange={handleInputChange}
                                    value={formData.preferredLanguage}
                                    required
                                    className="w-full p-4 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-blue-500">Location Preference:</label>
                                <select
                                    name="locationPreference"
                                    onChange={handleInputChange}
                                    value={formData.locationPreference}
                                    className="w-full p-4 border rounded"
                                >
                                    <option value="Remote">Remote</option>
                                    <option value="In-person">In-person</option>
                                    <option value="No Preference">No Preference</option>
                                </select>
                            </div>
                        </>
                    )}

                    {user.role === 'psychologist' && (
                        <>
                            <div className="mb-4">
                                <textarea
                                    name="bio"
                                    placeholder="Bio"
                                    onChange={handleInputChange}
                                    value={formData.bio}
                                    className="w-full p-4 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="languages"
                                    placeholder="Languages"
                                    onChange={handleInputChange}
                                    value={formData.languages.join(', ')}
                                    className="w-full p-4 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="specialization"
                                    placeholder="Specialization"
                                    onChange={handleInputChange}
                                    value={formData.specialization.join(', ')}
                                    className="w-full p-4 border rounded"
                                />
                            </div>
                        </>
                    )}

                    {message && (
                        <div className="mb-4 text-green-500">
                            {message}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
