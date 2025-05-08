import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: username,
          Password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
      
        // Store JWT token
        localStorage.setItem('token', data.token);
      
        // Optional: store username or other info if needed
        localStorage.setItem('username', username);
      
        navigate('/home');
        setError('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Could not connect to server');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Map */}
      <Map
        initialViewState={{
          longitude: 12.5939,
          latitude: 55.6632,
          zoom: 10,
        }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
        interactive={false}
        attributionControl={false}
      />

      {/* Optional dark overlay to dim the background */}
      <div className="absolute inset-0 backdrop-blur-xs bg-background-beige1/30 z-10" />

      {/* Login form */}
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-background-beige1 border-2 border-primary-brown bg-opacity-90 p-8 rounded-2xl shadow-md w-full max-w-sm"
        >
          <h2 className="text-display-1 font-display text-center text-primary-brown mb-6">Login</h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="relative mb-6">
          <label
              className="block mb-1 text-sm text-primary-brown"
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-2 border-b-2 focus:outline-none text-paragraph-1"
              placeholder="Username"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm text-primary-brown">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-2 border-b-2 focus:outline-none"
              required
            />
          </div>

          <p>I don't have an account</p>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
