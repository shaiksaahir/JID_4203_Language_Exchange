import React, { useState, useEffect } from 'react';
import { handleGetAllUsersApi, handleGetUserNamesApi } from '../Services/findFriendsService';

import './FriendSearch.css';

const FriendSearch = () => {
  const [userNames, setUserNames] = useState([]); // State to store fetched usernames
  const [recentChatPartners, setRecentChatPartners] = useState([]); // State for managing recent chat partners
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ name: '' }); // State for filter inputs



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

  

  // Function to handle adding a user to recent chat partners
  const handleUserClick = (user) => {
    // Add the user to the recent chat partners list, ensuring no duplicates
    if (!recentChatPartners.some((partner) => partner.firstName === user.firstName && partner.lastName === user.lastName)) {
      setRecentChatPartners([...recentChatPartners, user]);
    }
  };

  

  const handleFilterSubmit = async () => {
    try {
      setLoading(true); // Show loading while fetching data
      const response = await handleGetAllUsersApi({ name: filters.name }); // Fetch filtered data from backend
      if (response.data) {
        setUserNames(response.data); // Update the user list with the filtered data
      } else {
        setUserNames([]); // Clear the list if no data is returned
      }
      setLoading(false); // Stop loading after data is fetched
    } catch (err) {
      console.error('Error applying filter:', err);
      setError(err);
      setLoading(false); // Stop loading in case of an error
    }
  };
  // Function to handle removing a user from recent chat partners
  const handleRemoveChatPartner = (user) => {
    // Remove the user from the recent chat partners list
    const updatedPartners = recentChatPartners.filter(
      (partner) => !(partner.firstName === user.firstName && partner.lastName === user.lastName)
    );
    setRecentChatPartners(updatedPartners);
  };

  // Handle filter input change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="friend-search-container">
      {/* Left-side filter section */}
      <div className="filter-section">
        <h2>Filter Users</h2>
        <div className="filter-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Filter by name"
          />
        </div>
        <button className="filter-button" onClick={handleFilterSubmit}>Apply Filter</button>
      </div>

      {/* Main content area for user names */}
      <div className="friend-search">
        <h1>User Names</h1>
        <p>Click on a username to add them to your Recent Chat Partners:</p>
        <ul>
          {userNames.map((user, index) => (
            <li key={index}>
              <button className="user-button" onClick={() => handleUserClick(user)}>
                {user.firstName} {user.lastName}
              </button>
            </li> // Makes each username clickable to add to recent chat partners
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
                <div className="partner-item">
                  <span>{user.firstName} {user.lastName}</span>
                  <button className="remove-button" onClick={() => handleRemoveChatPartner(user)}>x</button>
                </div>
              </li> // Each recent chat partner has an "x" button to remove them
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default FriendSearch;
