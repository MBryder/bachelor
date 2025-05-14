import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { API_BASE } from '../services/api';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    if (!confirmPassword) {
      setPasswordsMatch(null);
    } else {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (!username.trim()) {
      setIsUsernameAvailable(null);
      return;
    }

    const debounce = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const res = await fetch(
          `${API_BASE}/user/check-username?username=${encodeURIComponent(username)}`
        );
        const data = await res.json();
        setIsUsernameAvailable(data.available);
      } catch (err) {
        console.error("Failed to check username:", err);
        setIsUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: username,
          Email: email,
          Password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Register successful:', data);
        localStorage.setItem('username', username);
        setError('');
        navigate('/home');
      } else if (response.status === 409) {
        const data = await response.json();
        setError(data.message || 'Username already taken');
      } else {
        const contentType = response.headers.get('Content-Type');
        const err = contentType && contentType.includes('application/json')
          ? (await response.json()).message
          : await response.text();
        setError(err || 'Register failed');
      }
    } catch (error) {
      console.error('Register error:', error);
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

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 backdrop-blur-xs bg-background-beige1/30 z-10" />

      {/* Signup form */}
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-background-beige1 border-2 border-primary-brown bg-opacity-90 p-8 rounded-2xl shadow-md w-full max-w-sm"
        >
          <h2 className="text-display-1 font-display text-center text-primary-brown mb-6">
            Sign Up
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="mb-4">
            <label className="block mb-1 text-sm text-primary-brown">Username</label>
            <div className="flex items-center border-b-2 border-primary-brown">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-grow px-4 bg-transparent focus:outline-none text-primary-brown"
                placeholder="Enter username"
                required
              />
              {username && (
                <div className="ml-2 text-sm">
                  {checkingUsername ? (
                    <span className="text-gray-500">🔍</span>
                  ) : isUsernameAvailable === false ? (
                    <span className="text-red-600 text-xs">❌</span>
                  ) : isUsernameAvailable === true ? (
                    <span className="text-green-600 text-xs">✅</span>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm text-primary-brown">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 border-b-2 border-primary-brown focus:outline-none bg-transparent"
              placeholder="Enter email"
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 border-b-2 border-primary-brown focus:outline-none bg-transparent"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm text-primary-brown">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 border-b-2 border-primary-brown focus:outline-none bg-transparent"
              placeholder="Re-enter password"
              required
            />
            <p className={`text-sm text-primary-brown transition-opacity duration-200 ${passwordsMatch === false ? 'opacity-100' : 'opacity-0'}`}>
              Passwords do not match
            </p>
          </div>

          <button
            type="submit"
            disabled={!isUsernameAvailable || !passwordsMatch}
            className={`w-full py-2 rounded-lg transition duration-200 border-1 
              ${isUsernameAvailable && passwordsMatch
                ? 'bg-primary-brown hover:bg-opacity-80 text-white'
                : 'bg-background-beige1 border- hover:bg-opacity-80 text-primary-brown cursor-not-allowed'}
            `}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );

};

export default Signup;