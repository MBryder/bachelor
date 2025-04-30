import { useNavigate } from 'react-router-dom';
import React from 'react';

function ProfileHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const goToHome = () => {
    navigate('/home');
  };

  return (
    <div className="h-[60px] border-b border-primary-brown flex items-center justify-between px-8">
      <div>
        <h1 className="text-display-1 font-display text-primary-brown">NextStop</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={goToHome}
          className="bg-primary-brown text-white px-4 py-2 rounded-xl shadow hover:bg-primary-dark transition duration-200"
        >
          Home
        </button>

        <button
          onClick={handleLogout}
          className="text-primary-brown hover:underline hover:cursor-pointer text-heading-3"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;
