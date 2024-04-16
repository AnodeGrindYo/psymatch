import React, { useState } from 'react';

function Login() {
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <div className="text-center">
        <div className="mb-8">
          <img src="psymatch-logo.png" alt="PsyMatch Logo" className="mx-auto h-48 w-auto" />
          {/* <h2 className="text-white text-xl font-semibold">MENTAL HEALTH STARTS HERE</h2> */}
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
            <form className="mb-4">
              <div className="mb-4">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="Username"
                />
              </div>
              <div className="mb-6">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
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
            <p className="text-white">
              Don't have an account?{' '}
              <a href="#register" className="text-blue-200 underline">
                Register here
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
