import React, { useState, useEffect } from 'react';
import { handleGetUserNamesApi, handleGetUserPreferencesApi, handleGetUserProfileApi } from '../Services/findFriendsService';
import './FriendSearch.css';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import { handleAddFriendApi } from '../Services/findFriendsService';
import Button from 'react-bootstrap/Button';
import { getUserData } from '../Utils/userData'; // Import to retrieve stored current user data

const FriendSearch = () => {
  const [filterInput, setFilterInput] = useState('');
  const [preferenceFilterInput, setPreferenceFilterInput] = useState('');
  const [recentChatPartners, setRecentChatPartners] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [allUserNames, setAllUserNames] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [compatibilityScore, setCompatibilityScore] = useState(null);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const id = search.get("id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching all user names and retrieving current user preferences...");

        const userResponse = await handleGetUserNamesApi();
        setUserNames(userResponse.data);
        setAllUserNames(userResponse.data);

        // Retrieve stored current user data from userData.js
        const currentUserData = getUserData();
        setCurrentUser(currentUserData);

        console.log("Fetched user names:", userResponse.data);
        console.log("Retrieved current user data:", currentUserData);

        setLoading(false);
      } catch (err) {
        setError(err);
        console.error("Error in fetchUserData:", err);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  const fetchUserProfile = async (userId) => {
    try {
      console.log("Fetching profile for selected user with ID:", userId);

      const response = await handleGetUserProfileApi(userId);
      console.log("Fetched selected user profile:", response.data);

      setSelectedUserProfile(response.data);

      if (currentUser && response.data) {
        calculateCompatibilityScore(response.data);
      } else {
        console.error("Current user data is missing during compatibility calculation.");
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const calculateCompatibilityScore = (selectedProfile) => {
    if (!currentUser || !selectedProfile) {
      console.error('Selected user profile or current user is missing, skipping score calculation.');
      return 0;
    }

    const genderScore = 6 * (selectedProfile.gender === currentUser.gender ? 1 : 0);
    const professionScore = 5 * (selectedProfile.profession === currentUser.profession ? 1 : 0);
    const hobbyScore = 5 * (selectedProfile.hobby === currentUser.hobby ? 1 : 0);
    const ageDifferenceScore = -0.3 * Math.abs((selectedProfile.age || 0) - (currentUser.age || 0));

    const totalScore = genderScore + professionScore + hobbyScore + ageDifferenceScore;
    
    console.log("Gender score:", genderScore);
    console.log("Profession score:", professionScore);
    console.log("Hobby score:", hobbyScore);
    console.log("Age difference score:", ageDifferenceScore);
    console.log("Total compatibility score:", totalScore);
    
    return totalScore;
  };

  const calculateAllCompatibilityScores = async () => {
    const scoredUsers = await Promise.all(
      userNames.map(async (user) => {
        const profile = await handleGetUserProfileApi(user.id);
        const score = calculateCompatibilityScore(profile.data);
        return { ...user, score };
      })
    );

    // Sort users by score in descending order
    const sortedUsers = scoredUsers.sort((a, b) => b.score - a.score);
    setUserNames(sortedUsers);
  };

  const handleNameFilter = () => {
    const lowerCaseFilterInput = filterInput.trim().toLowerCase();
    if (lowerCaseFilterInput === "") {
      setUserNames(allUserNames);
    } else {
      const filteredNames = allUserNames.filter(user =>
        user.firstName.toLowerCase().includes(lowerCaseFilterInput) ||
        user.lastName.toLowerCase().includes(lowerCaseFilterInput) ||
        user.email.toLowerCase().includes(lowerCaseFilterInput)
      );
      setUserNames(filteredNames.length > 0 ? filteredNames : allUserNames);
    }
  };

  const handlePreferenceFilter = async () => {
    const lowerCasePreferenceInput = preferenceFilterInput.trim().toLowerCase();

    if (lowerCasePreferenceInput === "") {
      setUserNames(allUserNames);
    } else {
      try {
        console.log("Filtering users by preferences...");

        const preferencesResponse = await handleGetUserPreferencesApi();
        const preferences = preferencesResponse.data;

        console.log("Fetched preferences:", preferences);

        const filteredPreferences = preferences.filter(pref =>
          Object.values(pref).some(value =>
            String(value).toLowerCase().includes(lowerCasePreferenceInput)
          )
        );

        if (filteredPreferences.length === 0) {
          setUserNames(allUserNames);
        } else {
          const matchedUserIds = filteredPreferences.map(pref => pref.id);
          const filteredNamesByPreferences = allUserNames.filter(user => matchedUserIds.includes(user.id));
          setUserNames(filteredNamesByPreferences.length > 0 ? filteredNamesByPreferences : allUserNames);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    }
  };

  const handleUserClick = (user) => {
    console.log("User clicked:", user);
    fetchUserProfile(user.id);
    if (!recentChatPartners.some(partner => partner.id === user.id)) {
      setRecentChatPartners([...recentChatPartners, user]);
    }
    const storedFriends = JSON.parse(localStorage.getItem('friendsList')) || [];
    if (!storedFriends.some(friend => friend.id === user.id)) {
      const updatedFriends = [...storedFriends, user];
      localStorage.setItem('friendsList', JSON.stringify(updatedFriends));
      setRecentChatPartners(updatedFriends);
    }
  };

  const handleRemovePartner = (userId) => {
    console.log("Removing recent chat partner with ID:", userId);
    const updatedPartners = recentChatPartners.filter(partner => partner.id !== userId);
    setRecentChatPartners(updatedPartners);
  };

  const handleBack = async (e) => {
    navigate({
      pathname: "/Dashboard",
      search: createSearchParams({
        id: id
      }).toString()
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="friend-search-container">
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

      <div className="friend-search">
        <h1>User Names</h1>
        <button className="calculate-score-btn" onClick={calculateAllCompatibilityScores}>
          Calculate Compatibility Scores
        </button>
        <ul className="user-list">
          {userNames.map((user, index) => (
            <li key={index}>
              <button className="user-button" onClick={() => handleUserClick(user)}>
                {user.firstName} {user.lastName} - ID: {user.id} - Score: {user.score || "N/A"}
              </button>
            </li>
          ))}
        </ul>

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

        {selectedUserProfile && (
          <div className="compatibility-score">
            <h3>Compatibility Score with {selectedUserProfile.firstName} {selectedUserProfile.lastName}:</h3>
            <p>{compatibilityScore}</p>
          </div>
        )}
      </div>

      <Button className="btn-help" onClick={handleBack}>Back</Button>
    </div>
  );
};

export default FriendSearch;