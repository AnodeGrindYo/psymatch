import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    role: 'patient', // ou 'psychologist'
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    preferredLanguage: '',
    issues: [],
    locationPreference: 'No Preference', // Pour les patients
    languages: [], // Pour les psychologues
    specialization: [], // Pour les psychologues
    bio: '', // Pour les psychologues
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique d'envoi des données à l'API (à compléter)
    console.log(formData);
    // appeler l'API ici avec les données du formulaire.
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-blue-500 mb-6">Register on PsyMatch</h2>
        <form onSubmit={handleSubmit}>
          {/* Select Role */}
          <div className="mb-4">
            <label className="block text-blue-500">You are a:</label>
            <select
              name="role"
              onChange={handleChange}
              value={formData.role}
              className="w-full p-2 border rounded"
            >
              <option value="patient">Patient</option>
              <option value="psychologist">Psychologist</option>
            </select>
          </div>

          {/* Shared Fields */}
          <div className="mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              value={formData.firstName}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.lastName}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Conditional Fields */}
          {formData.role === 'patient' && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="preferredLanguage"
                  placeholder="Preferred Language"
                  onChange={handleChange}
                  value={formData.preferredLanguage}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-blue-500">Location Preference:</label>
                <select
                  name="locationPreference"
                  onChange={handleChange}
                  value={formData.locationPreference}
                  className="w-full p-2 border rounded"
                >
                  <option value="Remote">Remote</option>
                  <option value="In-person">In-person</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>
            </>
          )}

          {formData.role === 'psychologist' && (
            <>
              <div className="mb-4">
                <textarea
                  name="bio"
                  placeholder="Bio"
                  onChange={handleChange}
                  value={formData.bio}
                  className="w-full p-2 border rounded"
                />
              </div>
            </>
          )}

          {/* Register Button */}
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
