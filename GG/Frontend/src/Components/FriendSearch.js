/**
 * New page which allows a user to see all of the other users with accounts on the application.
 * Author: Townshend White
 * Version 0.1 -- in future, page needs to display User Names but also be able to toggle through other UserAccount profile
 * preferences, which may require displaying data through getAllUsers rather than getUserNames
 */
import React, { useState, useEffect } from 'react';
import { handleGetUserNamesApi } from '../Services/findFriendsService'; // API function to fetch usernames
import './FriendSearch.css';

const FriendSearch = () => {
  const [userNames, setUserNames] = useState([]); // State to store fetched usernames
  const [recentChatPartners, setRecentChatPartners] = useState([]); // State for managing recent chat partners
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const response = await handleGetUserNamesApi(); // Fetch user names from the backend
        setUserNames(response.data); // Store fetched user names in state
        setLoading(false); // Stop loading once data is fetched
      } catch (err) {
        console.error('Error fetching user names:', err);
        setError(err); // Handle any errors
        setLoading(false); // Stop loading in case of an error
      }
    };

    fetchUserNames();
  }, []);

  // Function to handle clicking on a username
  const handleUserClick = (user) => {
    // Add the user to the recent chat partners list, ensuring no duplicates
    if (!recentChatPartners.includes(user)) {
      setRecentChatPartners([...recentChatPartners, user]);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="friend-search">
      <h1>User Names</h1>
      <p>Click on a username to add them to your Recent Chat Partners:</p>
      <ul>
        {userNames.map((user, index) => (
          <li key={index}>
            <button onClick={() => handleUserClick(user)}>
              {user.firstName} {user.lastName}
            </button>
          </li>
        ))}
      </ul>

      {/* Section for Recent Chat Partners */}
      <h2>Recent Chat Partners</h2>
      <ul>
        {recentChatPartners.length === 0 ? (
          <li>No recent chat partners.</li>
        ) : (
          recentChatPartners.map((user, index) => (
            <li key={index}>
              {user.firstName} {user.lastName}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FriendSearch;