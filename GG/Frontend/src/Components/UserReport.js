import React, { useState, useEffect } from 'react';
import './UserReport.css'; // Updated CSS filename
import Select from 'react-select';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { handleGetAllUsersApi } from '../Services/findFriendsService';

function UserReport() {
    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");

    const [users, setUsers] = useState([]); // State to store users
    const [selectedUser, setSelectedUser] = useState(''); // State to store selected user
    const [reportText, setReportText] = useState(''); // State for report text

    // Fetch all users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await handleGetAllUsersApi(); // Fetch user data
                const userOptions = userData.data.map((user) => ({
                    value: user.id,
                    label: `${user.firstName} ${user.lastName}`
                }));
                setUsers(userOptions);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Handle selection change
    const handleUserChange = (selectedOption) => {
        setSelectedUser(selectedOption); // Set selected user
        console.log("Selected user:", selectedOption);
    };

    // Handle report text change
    const handleReportTextChange = (e) => {
        setReportText(e.target.value);
    };

    // Navigate back to the dashboard or another page
    const handleBack = async (e) => {
        navigate({
            pathname: "/Dashboard",
            search: createSearchParams({
                id: id
            }).toString()
        });
    };

    return (
        <div className="screen-Background">
            <div className="screen-Container">
                <div className="screen-Content">
                    <h2>User Report</h2>
                    
                    {/* Dropdown */}
                    <div className="dropdown-container">
                        <Select
                            options={users}
                            value={selectedUser}
                            onChange={handleUserChange}
                            placeholder="Select a user..."
                            className="user-report-dropdown"
                        />
                    </div>
                    
                    {/* Textarea */}
                    <div className="textarea-container">
                        <textarea
                            placeholder="Enter your report or comments here..."
                            value={reportText}
                            onChange={handleReportTextChange}
                            className="user-report-textarea"
                        />
                    </div>
                    
                    {/* Buttons */}
                    <div className="button-container">
                        <Button className="btn-submit-report">Submit</Button>
                        <Button className="btn-back" onClick={handleBack}>Back</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserReport;