import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import './FriendsList.css';
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const id = search.get("id");

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

  const handleBack = () => {
    navigate({
      pathname: "/Dashboard", // Navigate back to the dashboard
      search: createSearchParams({ id: id }).toString(),
    });
  };

  return (
    <div className="screen-Background">
      <div className="screen-content">
        <h2>Your Friends List</h2>
        <p className="instructions">Please Click on a User to Remove them from Friends List</p>
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
      {/* Back Button */}
      <div className="button-container">
        <button className="btn-back-02" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default FriendsList;
