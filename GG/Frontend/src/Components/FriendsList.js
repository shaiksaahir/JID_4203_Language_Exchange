import React, { useEffect, useState } from 'react';
import './FriendsList.css';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Retrieve friends from localStorage
    const storedFriends = JSON.parse(localStorage.getItem('friendsList')) || [];
    setFriends(storedFriends);
    console.log("Friends loaded from localStorage:", storedFriends);
  }, []);

  const removeFriend = (firstName, lastName) => {
    // Filter out the clicked friend based on name
    const updatedFriends = friends.filter(friend => !(friend.firstName === firstName && friend.lastName === lastName));
    setFriends(updatedFriends);
    // Update localStorage
    localStorage.setItem('friendsList', JSON.stringify(updatedFriends));
    console.log(`Removed friend: ${firstName} ${lastName}`);
  };

  return (
    <div className="friends-list-container">
      <h2>Your Friends List</h2>
      {friends.length === 0 ? (
        <p className="no-friends-message">No friends added yet.</p>
      ) : (
        <div className="friends-list">
          {friends.map((friend, index) => (
            <div
              key={`${friend.firstName}-${friend.lastName}-${index}`}
              className="friend-chip"
              onClick={() => removeFriend(friend.firstName, friend.lastName)}
            >
              {friend.firstName} {friend.lastName}
              <span className="remove-icon">×</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
