import React, { useState, useEffect } from 'react';
import './Videocall.css';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { handleGetAllUsersApi } from '../Services/findFriendsService';
import Select from "react-select";

function PostVideocall() {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("id");

    const [reportUserId, setReportUserId] = useState(''); // Store user ID for reports

    const [users, setUsers] = useState([]); 
    const [selectedUser, setSelectedUser] = useState(null); 
    const [rating, setRating] = useState(0);
    const [targetLanguageProficiency, setTargetLanguageProficiency] = useState('');
    const [comment, setComment] = useState('');

    const TargetLanguageProficiency = [
        { value: "Beginner", label: "Beginner" },
        { value: "Elementary", label: "Elementary" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Proficient", label: "Proficient" },
        { value: "Fluent", label: "Fluent" },
    ];

    const userOptions = users.map((user) => ({
        value: user.id,
        label: `${user.name} (ID: ${user.id})`
    }));

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await handleGetAllUsersApi();
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleUserChange = (e) => {
        const userId = e.target.value;
        const user = users.find((user) => String(user.id) === String(userId));
        if (user) {
            setSelectedUser({ firstName: user.firstName, lastName: user.lastName });
        } else {
            setSelectedUser(null);
        }
    };

    const handleReportUserSelection = (user) => {
        console.log("Selected report user:", user); // Log the selected user object
        setReportUserId(user ? user.value : ""); // Set reportUserId to the selected user's ID
    };

    const handleReportUserChange = (e) => {
        setReportUserId(e.target.value); // Set report user ID directly
    };
    
    const handleAddFriend = () => {
        if (!selectedUser) return;
        const { firstName, lastName } = selectedUser;
        const friend = { firstName, lastName };
        const storedFriends = JSON.parse(localStorage.getItem('friendsList')) || [];
        const friendExists = storedFriends.some(
            f => f.firstName === friend.firstName && f.lastName === friend.lastName
        );
        if (!friendExists) {
            const updatedFriends = [...storedFriends, friend];
            localStorage.setItem('friendsList', JSON.stringify(updatedFriends));
        }
    };

    const handleSubmit = async () => {
        console.log("Report User ID:", reportUserId);
        console.log("Rating:", rating);
    
        try {
            const response = await fetch('/api/v1/update-rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating: rating,
                    user_id: reportUserId
                })
            });
    
            // Attempt to parse JSON response
            const data = await response.json();
            console.log(data.message); // Log success message from the server
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    return (
        <div className="videocall-container">
            <div className="form-container">
                <form className="videocall-form">
                    <div className="form-group">
                        <label>Leave comment for chat partner</label>
                        <input
                            placeholder="Enter Comment"
                            onChange={(e) => setComment(e.target.value)}
                            className="input"
                            type="text"
                        />
                    </div>

                    <div className="form-group">
                        <label>Rank chat partner's proficiency in their target language</label>
                        <Select 
                            options={TargetLanguageProficiency} 
                            onChange={(selectedOption) => setTargetLanguageProficiency(selectedOption.value)} 
                        />
                    </div>

                    <div className="form-group">
                        <label>Rate chat partner's ability as a study partner</label>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span
                                    key={num}
                                    onClick={() => setRating(num)}
                                    className={`star ${rating >= num ? 'selected' : ''}`}
                                >
                                    &#9733;
                                </span>
                            ))}
                        </div>
                        <p className="rating-output">Rating is: {rating}/5</p>
                    </div>
                </form>
            </div>

            <div className="buttons-container">
                <Button className="btn-help" onClick={() => navigate(`/Dashboard?id=${id}`)}>Back</Button>
              
              
              
                <div className="user-report-selection" style={{ marginTop: '20px' }}>
    <label htmlFor="reportUserDropdown" style={{ marginBottom: '10px', display: 'block' }}>User Report:</label>
    <select
        id="reportUserDropdown"
        value={reportUserId}
        onChange={handleReportUserChange}
        style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
    >
        <option value="">-- Select a User for Report --</option>
        {users.map((user) => (
            <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} - {user.email}
            </option>
        ))}
    </select>
</div>

<Button className="btn-submit" style={{ marginTop: '20px' }} onClick={handleSubmit}>
    Submit
</Button>

              
              
                
            </div>
            

            

            <div className="user-selection">
                <label>Select a User to Add as Friend:</label>
                <select
                    className="user-dropdown"
                    value={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
                    onChange={handleUserChange}
                >
                    <option value="">-- YOUR SELECTED USER -- </option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} - {user.email}
                        </option>
                    ))}
                </select>
            </div>
            <Button className="btn-add-friend" onClick={handleAddFriend} disabled={!selectedUser}>Add Friend</Button>
        </div>
    );
}

export default PostVideocall;
