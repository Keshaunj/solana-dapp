import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const { currentUser, updateUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser?.username) {
      setNewUsername(currentUser.username);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Not authenticated');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: newUsername,
          userId: currentUser._id
        })
      });

      const data = await response.json();

      if (response.ok) {
        updateUser({ ...currentUser, username: newUsername });
        setEditing(false);
      } else {
        setError(data.message || 'Failed to update username');
      }
    } catch (err) {
      setError('Error updating username');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium w-32">Username:</span>
          {editing ? (
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setNewUsername(currentUser?.username || '');
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-gray-800">{currentUser?.username}</span>
              <button
                onClick={() => setEditing(true)}
                className="text-purple-600 hover:text-purple-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
