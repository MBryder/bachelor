import React, { useEffect, useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';

interface Route {
  id: string;
  customName: string;
  createdAt: string;
  waypoints: string[];
}

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'savedRoutes'>('savedRoutes');
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

              {/* Tabs */}
              <div className="flex justify-center border-b border-gray-300 mb-6">
                <button
                  className={`px-4 py-2 text-sm font-semibold ${
                    activeTab === 'savedRoutes' ? 'border-b-2 border-brown text-brown' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('savedRoutes')}
                >
                  Saved Routes
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'savedRoutes' && (
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
                          className="p-4 bg-background-beige2 rounded-lg shadow border hover:bg-background-beige3 transition"
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
              )}
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
