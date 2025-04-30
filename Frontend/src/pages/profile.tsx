import React, { useEffect, useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    setUsername(storedUser);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background-beige1 text-text-dark">
      {/* ✅ Reusable header */}
      <ProfileHeader />

      {/* Profile content area */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-lg p-8 rounded-2xl max-w-md w-full text-center">
          <h1 className="text-display-1 mb-6">Profile</h1>

          {username ? (
            <>
              <p className="text-heading-2 mb-4">
                Welcome, <strong>{username}</strong>!
              </p>
              <p className="text-paragraph-1 mb-6">This is your profile page.</p>
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
