import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import Layout from './Layout';

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
        profilePicture: '',
    });

    const [message, setMessage] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                console.log('No user found in context');
                return;
            }

            console.log('Fetching data for user:', user);

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
                console.log('User data fetched:', userData);
                setFormData(userData);
                setProfileImage(userData.profilePicture);
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

    const handleFileChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            profilePicture: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            const response = await fetch(`/api/auth/updateUser/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: data
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setMessage('Profile updated successfully');
            setProfileImage(updatedUser.profilePicture);
        } catch (error) {
            setMessage(error.message);
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>; // Afficher un indicateur de chargement si l'utilisateur n'est pas encore chargé
    }

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen">
                <div className="relative p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
                    <Link to="/main" className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700">
                        &times;
                    </Link>
                    <h2 className="text-xl font-semibold text-blue-500 mb-6">Profil</h2>
                    {profileImage ? (
                        <img 
                            src={profileImage} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-full mx-auto mb-4" 
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center bg-gray-200">
                            <i className="fas fa-user fa-3x text-gray-500"></i>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-4">
                            <label className="block text-gray-700">Prénom</label>
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
                            <label className="block text-gray-700">Nom</label>
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
                            <label className="block text-gray-700">Email</label>
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
                        <div className="mb-4">
                            <label className="block text-gray-700">Photo de profil</label>
                            <input
                                type="file"
                                name="profilePicture"
                                onChange={handleFileChange}
                                className="w-full p-4 border rounded"
                            />
                        </div>

                        {user.role === 'patient' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Langue préférée</label>
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
                                    <label className="block text-gray-700">Préférence de localisation</label>
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
                                    <label className="block text-gray-700">Bio</label>
                                    <textarea
                                        name="bio"
                                        placeholder="Bio"
                                        onChange={handleInputChange}
                                        value={formData.bio}
                                        className="w-full p-4 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Langues</label>
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
                                    <label className="block text-gray-700">Spécialisation</label>
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
                                Sauvegarder les modifications
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
