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
    const [userProficiency, setUserProficiency] = useState("N/A"); // Store user's proficiency
    const [userRating, setUserRating] = useState("N/A"); // Store user's rating

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await handleGetAllUsersApi(); // Fetch user data
                const userOptions = userData.map((user) => ({
                    value: user.id,
                    label: `${user.firstName} ${user.lastName}`,
                }));
                setUsers(userOptions);
                console.log("User options for dropdown:", userOptions);
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

    // Fetch proficiency and rating for the selected user
    const fetchUserProficiencyAndRating = async () => {
        if (!selectedUser) {
            console.warn("No user selected.");
            return;
        }

        console.log("Fetching proficiency and rating for user ID:", selectedUser.value);

        try {
            const response = await handleGetUserProfileApi(selectedUser.value);
            const userProfile = response.data;

            console.log("Complete fetched data structure:", userProfile);

            // Validate and set proficiency and rating if available
            if (userProfile && userProfile.proficiency && userProfile.rating) {
                setUserProficiency(userProfile.proficiency);
                setUserRating(userProfile.rating);
                console.log("Proficiency:", userProfile.proficiency, "Rating:", userProfile.rating);
            } else {
                console.warn("Proficiency or rating data is missing.");
                setUserProficiency("N/A");
                setUserRating("N/A");
            }
        } catch (error) {
            console.error("Error fetching user's proficiency and rating:", error);
            setUserProficiency("N/A");
            setUserRating("N/A");
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
                    
                    {/* Display proficiency and rating */}
                    <div className="user-info">
                        <p><strong>Proficiency:</strong> {userProficiency}</p>
                        <p><strong>Rating:</strong> {userRating}</p>
                    </div>
                    
                    {/* Buttons */}
                    <div className="button-container">
                        <Button className="btn-fetch-user" onClick={fetchUserProficiencyAndRating}>Fetch User</Button>
                        <Button className="btn-back" onClick={handleBack}>Back</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserReport;