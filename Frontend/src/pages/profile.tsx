import React, { useEffect, useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'savedRoutes'>('savedRoutes');

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    setUsername(storedUser);
  }, []);

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

              {/* Tab buttons */}
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

              {/* Tab content */}
              {activeTab === 'savedRoutes' && (
                <div className="text-left text-paragraph-1">
                  <p className="mb-2 font-semibold">Your saved routes will appear here.</p>
                  <p className="text-sm text-gray-500">You don’t have any saved routes yet.</p>
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
