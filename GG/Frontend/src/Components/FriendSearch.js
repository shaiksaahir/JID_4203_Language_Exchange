/**
 * New page which allows a user to see all of the other users with accounts on the application.
 * Author: Townshend White
 * Version 0.1 -- in future, page needs to display User Names but also be able to toggle through other UserAccount profile
 * preferences, which may require displaying data through getAllUsers rather than getUserNames
 */
import React, { useState, useEffect } from 'react';
import { handleGetUserNamesApi } from '../Services/findFriendsService'; // FindFriendsService handles the API address
import './FriendSearch.css';

const FriendSearch = () => {
  const [userNames, setUserNames] = useState([]); // define initial state of UserNames before fetching data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const response = await handleGetUserNamesApi(); // Call the API function that retrieves the first and last name of each UserAccount
        console.log('API response:', response.data); // Log the response data
        setUserNames(response.data); // Directly set data to UserNames array to be used in a map and displayed to users
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error('Error fetching user names:', err);
        setError(err); // Set error if there is an issue
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchUserNames();
  }, []);

  console.log('User names state:', userNames); // Log new state of UserNames after fetch; should be an array of names

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="friend-search">
      <h1>User Names</h1>
      <p>Here are the user names from the database:</p>
      <ul>
        {userNames.map((user, index) => (
          <li key={index}>{user.firstName} {user.lastName}</li> // display User Names
        ))}
      </ul>
    </div>
  );
};

export default FriendSearch;
