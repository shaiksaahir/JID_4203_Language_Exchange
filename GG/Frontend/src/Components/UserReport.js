import React, { useState, useEffect } from 'react';
import './UserReport.css';
import Select from 'react-select';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { handleGetAllUsersApi, handleGetUserProfileApi } from '../Services/findFriendsService';

function UserReport() {
    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");

    const [users, setUsers] = useState([]); // Store user options
    const [selectedUser, setSelectedUser] = useState(null); // Store selected user
    const [userInfo, setUserInfo] = useState(null); // Store user info (rating, proficiency, comments)
    const [hidden, setHidden] = useState(false); // Track if the user has "hide" visibility

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await handleGetAllUsersApi(); // Fetch user data
                const userOptions = userData.map((user) => ({
                    value: user.id,
                    label: `${user.firstName} ${user.lastName}`, // Match display structure
                }));
                setUsers(userOptions);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Handle user selection
    const handleUserChange = (selectedOption) => {
        setSelectedUser(selectedOption);
        console.log("Selected user:", selectedOption);
    };

    // Fetch selected user's profile data when "Fetch User" button is clicked
    const handleFetchUser = async () => {
        if (selectedUser) {
            try {
                const response = await handleGetUserProfileApi(selectedUser.value);
                console.log("Fetched user profile:", response.data);

                const userProfile = response.data;

                // Check visibility and set state accordingly
                if (userProfile.visibility === "Hide") {
                    setHidden(true);
                    setUserInfo(null); // Clear existing user info
                } else {
                    setHidden(false);
                    setUserInfo({
                        rating: userProfile.rating || "N/A",
                        proficiency: userProfile.proficiency || "N/A",
                        comments: userProfile.comments || "N/A",
                    });
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        } else {
            console.log("No user selected.");
        }
    };

    // Navigate back to the dashboard
    const handleBack = () => {
        navigate({
            pathname: "/Dashboard",
            search: createSearchParams({ id: id }).toString(),
        });
    };

    return (
        <div className="screen-Background">
            <div className="screen-Container">
                <div className="screen-Content">
                    <h2>User Report</h2>
                    
                    {/* User dropdown */}
                    <div className="dropdown-container">
                        <Select
                            options={users}
                            value={selectedUser}
                            onChange={handleUserChange}
                            placeholder="Select a user..."
                            className="user-report-dropdown"
                        />
                    </div>

                    {/* Conditional rendering based on visibility */}
                    {hidden ? (
                        <div className="data-display">
                            <h3>User Information is Hidden</h3>
                        </div>
                    ) : (
                        userInfo && (
                            <>
                                {/* Display rating */}
                                <div className="data-display">
                                    <h3>Rating:</h3>
                                    <p>{userInfo.rating}</p>
                                </div>

                                {/* Display proficiency */}
                                <div className="data-display">
                                    <h3>Proficiency:</h3>
                                    <p>{userInfo.proficiency}</p>
                                </div>

                                {/* Display comments */}
                                <div className="data-display">
                                    <h3>Comments:</h3>
                                    <p>{userInfo.comments}</p>
                                </div>
                            </>
                        )
                    )}

                    {/* Buttons */}
                    <div className="button-container">
                        <button className="btn-back-02" onClick={handleBack}>Back</button>
                        <button className="btn-fetch" onClick={handleFetchUser}>
                            Fetch User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserReport;