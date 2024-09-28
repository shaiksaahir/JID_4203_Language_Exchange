/**
 * New page which allows a user to see all of the other users with accounts on the application.
 * Author: Townshend White
 * Version 0.1 -- in future, page needs to display User Names but also be able to toggle through other UserAccount profile
 * preferences, which may require displaying data through getAllUsers rather than getUserNames
 */
import React, { useState, useEffect } from 'react';

import { handleGetUserNamesApi, handleGetUserPreferencesApi } from '../Services/findFriendsService';
import './FriendSearch.css';

const FriendSearch = () => {
  const [userNames, setUserNames] = useState([]);
  const [allUserNames, setAllUserNames] = useState([]); // Store all users for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterInput, setFilterInput] = useState(''); // For name filtering
  const [preferenceFilterInput, setPreferenceFilterInput] = useState(''); // For preference filtering

  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const response = await handleGetUserNamesApi(); // Fetch all user names
        setUserNames(response.data);
        setAllUserNames(response.data); // Store original list
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUserNames();
  }, []);

  // Filter by name or email
  const handleNameFilter = () => {
    if (filterInput.trim() === "") {
      setUserNames(allUserNames); // Reset to all users if input is empty
    } else {
      const filteredNames = allUserNames.filter(user =>
        user.firstName.toLowerCase().includes(filterInput.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filterInput.toLowerCase()) ||
        user.email.toLowerCase().includes(filterInput.toLowerCase())
      );
      setUserNames(filteredNames.length > 0 ? filteredNames : allUserNames); // If no match, show all users
    }
  };

  // Filter by preferences (using preference API)
  const handlePreferenceFilter = async () => {
    if (preferenceFilterInput.trim() === "") {
      setUserNames(allUserNames); // Reset to all users if input is empty
    } else {
      try {
        const preferencesResponse = await handleGetUserPreferencesApi(); // Fetch all preferences
        const preferences = preferencesResponse.data;

        // Filter preferences based on input value
        const filteredPreferences = preferences.filter(pref =>
          Object.values(pref).some(value =>
            String(value).toLowerCase().includes(preferenceFilterInput.toLowerCase())
          )
        );

        // If no match, show all users
        if (filteredPreferences.length === 0) {
          setUserNames(allUserNames);
        } else {
          // Extract matching user IDs from preferences
          const matchedUserIds = filteredPreferences.map(pref => pref.id);

          // Filter usernames by matching IDs
          const filteredNamesByPreferences = allUserNames.filter(user => matchedUserIds.includes(user.id));

          // If no match, show all users
          setUserNames(filteredNamesByPreferences.length > 0 ? filteredNamesByPreferences : allUserNames);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="friend-search-container">
      {/* Filter Sidebar */}
      <div className="filter-sidebar">
        {/* Filter by Name Section */}
        <div className="filter-section">
          <h3>Filter Users by Name</h3>
          <input
            type="text"
            placeholder="Enter name or email"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
          />
          <button onClick={handleNameFilter}>
            Filter by Name
          </button>
        </div>

        {/* Filter by Preferences Section */}
        <div className="filter-section">
          <h3>Filter Users by Preference</h3>
          <input
            type="text"
            placeholder="Enter preference"
            value={preferenceFilterInput}
            onChange={(e) => setPreferenceFilterInput(e.target.value)}
          />
          <button onClick={handlePreferenceFilter}>
            Filter by Preference
          </button>
        </div>
      </div>

      {/* Main Search Area */}
      <div className="friend-search">
        <h1>User Names</h1>
        <p>Here are the user names from the database:</p>
        <ul>
          {userNames.map((user, index) => (
            <li key={index}>
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendSearch;
