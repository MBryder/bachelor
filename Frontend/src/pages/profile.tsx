// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import { useSelectedRoute } from '../context/SelectedRouteContext';

interface Route {
  id: string;
  customName: string;
  createdAt: string;
  waypoints: string[];
}

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setSelectedRoute } = useSelectedRoute();

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    setUsername(storedUser);
  }, []);

  useEffect(() => {
    if (username) {
      setLoadingRoutes(true);
      fetch(`http://localhost:5001/user/${username}/routes`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch saved routes');
          return res.json();
        })
        .then(data => {
          setSavedRoutes(data); 
          setLoadingRoutes(false);
        })
        .catch(err => {
          setError(err.message);
          setLoadingRoutes(false);
        });
    }
  }, [username]);

  return (
    <div className="flex flex-col min-h-screen bg-background-beige1 text-text-dark">
      <ProfileHeader />
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-lg p-8 rounded-2xl max-w-2xl w-full text-center">
          <h1 className="text-display-1 mb-6">Profile</h1>
          {username ? (
            <>
              <p className="text-heading-2 mb-4">
                Welcome, <strong>{username}</strong>!
              </p>

              <div className="text-left text-paragraph-1">
                {loadingRoutes ? (
                  <p>Loading saved routes...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : savedRoutes.length === 0 ? (
                  <p className="text-sm text-gray-500">You don’t have any saved routes yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {savedRoutes.map(route => (
                      <li
                        key={route.id}
                        onClick={() => {
                          setSelectedRoute(route);
                          navigate('/home');
                        }}
                        className="p-4 bg-background-beige2 rounded-lg shadow border hover:bg-background-beige3 transition cursor-pointer"
                      >
                        <p className="font-semibold">{route.customName}</p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(route.createdAt).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <p className="text-red-500">No user logged in.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
