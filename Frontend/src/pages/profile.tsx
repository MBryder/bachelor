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

  const profileDuration = "5 months and 24 days"; // Ideally calculate this dynamically
  const lastActive = "2 hours ago"; // Also dynamic in real setup

  return (
    <div className="flex flex-col min-h-screen bg-background-beige1 text-text-dark">
      <ProfileHeader />
      <div className="flex-grow flex items-center justify-center py-10">
        <div className="bg-white shadow-lg p-6 rounded-xl w-full max-w-4xl">
          <h1 className="text-display-1 border-b pb-2 mb-6">mBryder's Profile</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-black text-white w-20 h-20 flex items-center justify-center rounded text-3xl font-bold">
              B
            </div>
            <div>
              <p className="text-xl font-semibold">{username}</p>
              <p className="text-sm text-gray-600">Member for {profileDuration}</p>
              <p className="text-sm text-gray-600">Last active {lastActive}</p>
            </div>
          </div>

          <div className="border-b mb-4">
            <button className="py-2 px-4 border-b-2 border-blue-500 font-semibold">Member</button>
            <button className="py-2 px-4 text-gray-500">Posts</button>
          </div>

          <div className="text-paragraph-1">
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
