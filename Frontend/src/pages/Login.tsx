import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { loginUser } from '../services/userService';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser({ Username: username, Password: password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      navigate('/home');
      setError('');
    } catch (err: any) {
      console.log(err.message[0]);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Map
        initialViewState={{ longitude: 12.5939, latitude: 55.6632, zoom: 10 }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
        interactive={false}
        attributionControl={false}
      />
      <div className="absolute inset-0 backdrop-blur-xs bg-background-beige1/30 z-10" />
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-background-beige1 border-2 border-primary-brown bg-opacity-90 p-8 rounded-2xl shadow-md w-full max-w-sm"
        >
          <h2 className="text-display-1 font-dasdisplay text-center text-primary-brown mb-6">Login</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <div className="relative mb-6">
            <label className="block mb-1 text-sm text-primary-brown">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-2 border-b-2 focus:outline-none"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-primary-brown">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-2 border-b-2 focus:outline-none"
              placeholder="Password"
              required
            />
          </div>

            <p className="mb-6 text-paragraph-1 text-primary-brown">
              I don't have an account?{' '}
              <span
                className="text-primary-brown underline cursor-pointer"
                onClick={() => navigate('/signup')}
              >
                Click here
              </span>
            </p>

          <button
            type="submit"
            className="w-full bg-primary-brown hover:opacity-95 text-white py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
