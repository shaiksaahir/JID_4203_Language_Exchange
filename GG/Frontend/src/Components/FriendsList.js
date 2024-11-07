import React, { useEffect, useState } from 'react';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Retrieve friends from localStorage
    const storedFriends = JSON.parse(localStorage.getItem('friendsList')) || [];
    setFriends(storedFriends);
  }, []);

  const removeFriend = (id) => {
    // Filter out the clicked friend
    const updatedFriends = friends.filter(friend => friend.id !== id);
    setFriends(updatedFriends);
    // Update localStorage
    localStorage.setItem('friendsList', JSON.stringify(updatedFriends));
  };

  return (
    <div>
      <h2>Your Friends List</h2>
      {friends.length === 0 ? (
        <p>No friends added yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {friends.map((friend, index) => (
            <button
              key={index}
              onClick={() => removeFriend(friend.id)}
              style={{
                padding: '10px',
                borderRadius: '20px',
                border: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {friend.firstName} {friend.lastName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
