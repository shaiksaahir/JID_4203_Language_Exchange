import React, { useState, useEffect } from 'react';
import { handleGetUserNamesApi, handleGetUserPreferencesApi } from '../Services/findFriendsService';
import './FriendSearch.css';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import { handleAddFriendApi } from '../Services/findFriendsService';
import { handleFindFriendsApi, handleCreateFriendsApi } from '../Services/findFriendsService';

import { handleUserDashBoardApi } from '../Services/dashboardService';
import { useLocation } from 'react-router-dom';



import Button from 'react-bootstrap/Button';

const FriendSearch = () => {
  
 // const [allUserNames, setAllUserNames] = useState([]); // Store all users for filtering
 
  const [filterInput, setFilterInput] = useState(''); // For name filtering
  const [preferenceFilterInput, setPreferenceFilterInput] = useState(''); // For preference filtering
  const [recentChatPartners, setRecentChatPartners] = useState([]); // State to manage recent chat partners
 
  
  

 
  // Retrieve the user data from location.state
  

  // Now you can use id, FName, LName, and email in your component

 
  const location = useLocation();




  //const [errMessage setErrMsg] = useState('');
  const[search] = useSearchParams();

  const { id } = location.state || {};


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userNames, setUserNames] = useState([]);
  const [allUserNames, setAllUserNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Now you can use id, FName, LName, and email in your component
  
  const[friendids, setfriendids] = useState([]);
  const[name, setName] = useState([]);
  const navigate = useNavigate();
  // it should be coming from friend list database a list of id and names to show
  
  
  
  //let friendids = [];
  //let name = ["prit","quyen","maisa","akshar","pratham"];
  let names = [] 
  let array = []

  let videoCalls = []

  let data;
  
  

  

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
  }, [id]);

  // Filter by name or email
  const handleNameFilter = () => {
    const lowerCaseFilterInput = filterInput.trim().toLowerCase(); // Convert input to lowercase once

    if (lowerCaseFilterInput === "") {
      setUserNames(allUserNames); // Reset to all users if input is empty
    } else {
      const filteredNames = allUserNames.filter(user =>
        user.firstName.toLowerCase().includes(lowerCaseFilterInput) ||
        user.lastName.toLowerCase().includes(lowerCaseFilterInput) ||
        user.email.toLowerCase().includes(lowerCaseFilterInput)
      );
      setUserNames(filteredNames.length > 0 ? filteredNames : allUserNames); // If no match, show all users
    }
  };

  // Filter by preferences (using preference API)
  const handlePreferenceFilter = async () => {
    const lowerCasePreferenceInput = preferenceFilterInput.trim().toLowerCase(); // Convert input to lowercase once

    if (lowerCasePreferenceInput === "") {
      setUserNames(allUserNames); // Reset to all users if input is empty
    } else {
      try {
        const preferencesResponse = await handleGetUserPreferencesApi(); // Fetch all preferences
        const preferences = preferencesResponse.data;

        // Filter preferences based on input value
        const filteredPreferences = preferences.filter(pref =>
          Object.values(pref).some(value =>
            String(value).toLowerCase().includes(lowerCasePreferenceInput)
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

  // Handle click to add a user to recent chat partners
  const handleUserClick = async (user) => {
    // Prevent duplicates in the recent chat partners list
    if (!recentChatPartners.some(partner => partner.id === user.id)) {
      setRecentChatPartners([...recentChatPartners, user]);
    }
    // Add the friendship to the FriendsList table in the database
   // try {
      //await handleAddFriendApi(id, user.id, { firstName: user.firstName, lastName: user.lastName });
   //   console.log('Friend added to the database');
  //  } catch (error) {
   //   console.error('Error adding friend to the database:', error);
  //  }
  // Retrieve existing friends from localStorage or initialize an empty array
  const storedFriends = JSON.parse(localStorage.getItem('friendsList')) || [];

  // Check if the user is already in the friends list to avoid duplicates
  if (!storedFriends.some(friend => friend.id === user.id)) {
    const updatedFriends = [...storedFriends, user]; // Add the new friend
    localStorage.setItem('friendsList', JSON.stringify(updatedFriends)); // Save updated list to localStorage
    setRecentChatPartners(updatedFriends); // Update local component state if necessary
  }
  };

  // Handle removing a user from recent chat partners
  const handleRemovePartner = (userId) => {
    const updatedPartners = recentChatPartners.filter(partner => partner.id !== userId);
    setRecentChatPartners(updatedPartners);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleBack = async (e) => {
    navigate({
      pathname: "/Dashboard",
      search: createSearchParams({
        id: id
      }).toString()
    });
  };

  return (
    <div className="friend-search-container">
      {/* Filter Sidebar */}
      <div className="filter-sidebar">
        <div className="filter-section">
          <h3>Filter Users by Name</h3>
          <input
            type="text"
            placeholder="Enter name or email"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
          />
          <button className="filter-btn" onClick={handleNameFilter}>Filter by Name</button>
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
          <button className="filter-btn" onClick={handlePreferenceFilter}>Filter by Preference</button>
        </div>
      </div>

      {/* Main Search Area */}
<div className="friend-search">
  <h1>User Names</h1>
  <p>Here are Usernames from the Database:</p>
  <ul className="user-list">
    {userNames.map((user, index) => (
      <li key={index}>
        <button className="user-button" onClick={() => handleUserClick(user)}>
          {user.firstName} {user.lastName}, ID: {user.id}
        </button>
      </li>
    ))}
  </ul>

        {/* Section for Recent Chat Partners */}
        <h2>Recent Chat Partners</h2>
        <ul className="recent-chat-list">
          {recentChatPartners.length === 0 ? (
            <li>No recent chat partners.</li>
          ) : (
            recentChatPartners.map((user, index) => (
              <li key={index} className="recent-chat-partner">
                <button className="user-button">
                  {user.firstName} {user.lastName}
                </button>
                <button className="remove-button" onClick={() => handleRemovePartner(user.id)}>X</button>
              </li>
            ))
          )}
        </ul>
      </div>
      <div>
      <Button className="btn-help" onClick={handleBack}>Back</Button>
      </div>
    </div>
  );
};

export default FriendSearch;

