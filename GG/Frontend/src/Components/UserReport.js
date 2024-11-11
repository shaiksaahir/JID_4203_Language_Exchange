import React, { useState, useEffect } from 'react';
import './UserReport.css';
import Select from 'react-select';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { handleGetAllUsersApi } from '../Services/findFriendsService';

function UserReport() {
    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");

    const [users, setUsers] = useState([]); // Store user options
    const [selectedUser, setSelectedUser] = useState(null); // Store selected user
    const [reportText, setReportText] = useState(''); // Store report text

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

    // Handle report text change
    const handleReportTextChange = (e) => {
        setReportText(e.target.value);
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
                    
                    {/* Report textarea */}
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
