import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/header';
import { useSelectedRoute } from '../context/SelectedRouteContext';
import { Route } from '../utils/types';
import { API_BASE } from '../services/api';


const Profile: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setSelectedRoute } = useSelectedRoute();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    setUsername(storedUser);
  }, []);

  useEffect(() => {
    if (username) {
      setLoadingRoutes(true);
      fetch(`${API_BASE}/user/${username}/routes`)
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

  const profileDuration = "xxxx"; // Ideally calculate this dynamically


  return (
    <div className="flex flex-col min-h-screen bg-background-beige1 text-text-dark">
      <ProfileHeader />
      <div className="flex-grow flex items-center justify-center py-10">
        <div className="bg-white shadow-lg p-6 rounded-xl w-full max-w-4xl">

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-black text-white w-20 h-20 flex items-center justify-center rounded text-3xl font-bold">
              B
            </div>
            <div>
              <p className="text-xl font-semibold">{username}</p>
              <p className="text-sm text-gray-600">Member since: {profileDuration}</p>
            </div>
          </div>

          <div className="border-b mb-4">
            <button className="py-2 px-4 border-b-2 border-blue-500 font-semibold">Saved routes</button>
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
                    className="p-4 bg-background-beige2 rounded-lg shadow border hover:bg-background-beige3 transition flex justify-between items-center"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        setSelectedRoute(route);
                        navigate('/home');
                      }}
                    >
                      <p className="font-semibold">{route.customName}</p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(route.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!username) return;

                        try {
                          const res = await fetch(`${API_BASE}/user/${username}/routes/${route.id}`, {
                            method: 'DELETE'
                          });
                          if (!res.ok) throw new Error("Failed to delete route.");
                          setSavedRoutes(prev => prev.filter(r => r.id !== route.id));
                        } catch (err) {
                          alert("Could not delete route. Please try again.");
                          console.error(err);
                        }
                      }}
                      className="ml-4 text-red-500 hover:text-red-700 text-lg font-bold"
                      title="Delete route"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Password Change Section */}
          <div className="mt-10 border-t pt-6">
            <h2 className="text-heading-3 text-primary-brown mb-4">Change Password</h2>

            {passwordChangeMessage && (
              <p className="mb-2 text-sm text-green-600">{passwordChangeMessage}</p>
            )}

            <div className="flex flex-col gap-4 max-w-sm">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                className="border px-3 py-2 rounded-md"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="border px-3 py-2 rounded-md"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="border px-3 py-2 rounded-md"
              />
              <button
                onClick={async () => {
                  if (!username) return;

                  if (!currentPassword || !newPassword || !confirmPassword) {
                    alert("All fields are required.");
                    return;
                  }

                  if (newPassword !== confirmPassword) {
                    alert("New passwords do not match.");
                    return;
                  }

                  try {
                    const res = await fetch(`${API_BASE}/user/change-password`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        username,
                        currentPassword,
                        newPassword,
                      }),
                    });

                    if (!res.ok) {
                      const err = await res.text();
                      throw new Error(err);
                    }

                    setPasswordChangeMessage("✅ Password changed successfully!");
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  } catch (err: any) {
                    alert(err.message || "Failed to change password.");
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={async () => {
            const confirmDelete = window.confirm("⚠ Are you sure you want to permanently delete your account?");
            if (!confirmDelete || !username) return;

            try {
              const res = await fetch(`${API_BASE}/user/${username}`, {
                method: 'DELETE'
              });

              if (!res.ok) throw new Error("Failed to delete user.");

              localStorage.removeItem('username');
              localStorage.removeItem('token');
              alert("Your account has been deleted.");
              navigate('/login');
            } catch (err) {
              alert("Something went wrong. Please try again.");
              console.error(err);
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
