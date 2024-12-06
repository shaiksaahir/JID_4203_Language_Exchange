import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import './FriendsList.css';
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom";
import { handleGetFriendsList, handleAddToFriendsList } from '../Services/userService'; // Import your API handler

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const id = search.get("id");

  useEffect(() => {
    // Retrieve friends from localStorage
    const storedFriends = JSON.parse(localStorage.getItem('friendsList')) || [];
    //setFriends(storedFriends);
    console.log("Friends loaded from localStorage:", storedFriends);
  }, []);

  // Second useEffect: Fetch friends from the database
  useEffect(() => {
    const fetchFriendsFromDB = async () => {
      if (!id) {
        console.error('User ID is missing in the query string.');
        return;
      }

      try {
        console.log("Fetching friends list from the database for user ID:", id);
        const response = await handleGetFriendsList(id);
        console.log("Full API Response:", response);
    
        // Adjusted to check the correct structure
        if (response?.friendsList && Array.isArray(response.friendsList)) {
            setFriends(response.friendsList); // Directly set friends from the database
            console.log("Friends list from database:", response.friendsList);
        } else {
            console.error('Unexpected response structure:', response);
            setFriends([]); // Default to an empty array if the structure is invalid
        }
      } catch (error) {
          console.error('Error fetching friends list:', error);
          setFriends([]); // Handle the error by resetting to an empty array
      }
    };

    fetchFriendsFromDB();
  }, [id]); // Dependencies: id and friends state

  const removeFriend = async (firstName, lastName) => {
    const updatedFriends = friends.filter(
      (friend) => !(friend === `${firstName} ${lastName}`)
    );
    setFriends(updatedFriends);
  
    try {
      console.log("Updating database with new friends list:", updatedFriends);
      const response = await handleAddToFriendsList(id, updatedFriends);
  
      // Ensure the response structure is valid
      if (response?.data?.message) {
        console.log("Database update response:", response.data.message);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error('Error updating friends list in the database:', error);
    }
  };

  const handleBack = () => {
    navigate({
      pathname: "/Dashboard", // Navigate back to the dashboard
      search: createSearchParams({ id: id }).toString(),
    });
  };

  return (
    <div className="screen-Background">
      <div className="friends-list-container">
        <h2>Your Friends List</h2>
        <p className="instructions">Please Click on a User to Remove them from Friends List</p>
        {friends.length === 0 ? (
          <p className="no-friends-message">No friends added yet.</p>
        ) : (
          <div className="friends-list">
            {friends.map((friend, index) => (
              <div
                key={`${friend}-${index}`} // Ensure each item has a unique key
                className="friend-chip"
                onClick={() => {
                  const [firstName, lastName] = friend.split(' '); // Split the full name into first and last names
                  removeFriend(firstName, lastName); // Pass them to the removeFriend function
                }}
              >
                {friend} {/* Display the full name */}
                <span className="remove-icon">×</span>
              </div>
            ))}
          </div>
        )}
        {/* Back Button */}
        <div className="button-container">
          <button className="btn-back-02" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
