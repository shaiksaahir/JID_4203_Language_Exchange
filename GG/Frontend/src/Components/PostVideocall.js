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

    const [users, setUsers] = useState([]); // State to store users
    const [selectedUser, setSelectedUser] = useState(''); // State to store selected user
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

    // Fetch all users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await handleGetAllUsersApi();
                setUsers(userData); // Set users from fetched data
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleRating = (n) => {
        setRating(n);
    };

    const handleTargetLanguageProficiency = (selectedOption) => {
        setTargetLanguageProficiency(selectedOption.value);
    };

    const handleComment = (e) => {
        setComment(e.target.value);
    };

    const handleUserChange = (e) => {
        setSelectedUser(e.target.value); // Update selected user
    };

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
                    <form>
                        <div className='form-group'>
                            <label className="label">Leave comment for chat partner</label>
                            <input
                                placeholder="Enter Comment"
                                onChange={handleComment} className="input"
                                type="text" />
                        </div>
                        <br />

                        <div className='form-group'>
                            <label className="label">Rank chat partner's proficiency in their target language</label>
                            <Select options={TargetLanguageProficiency} onChange={handleTargetLanguageProficiency} />
                        </div>
                        <br />

                        <div className='form-group'>
                            <div>
                                <label className="label">Rate chat partner's ability as a study partner</label>
                                <div className="stars">
                                    {[1, 2,3,4,5].map((num) => (
                                        <span
                                            key={num}
                                            onClick={() => handleRating(num)}
                                            className={`star ${rating >= num ? 'selected' : ''}`}
                                        >
                                            &#9733;
                                        </span>
                                    ))}
                                </div>
                                <p id="output">
                                    Rating is: {rating}/5
                                </p>
                            </div>
                        </div>
                    </form>
                </div>

                <Button className="btn-help" onClick={handleBack}>Back</Button>

                {/* User Selection Dropdown at the Very Bottom */}
                <div className="bottom-user-selection">
                    <label htmlFor="userDropdown" style={{ marginBottom: '10px', display: 'block' }}>Select a User:</label>
                    <select
                        id="userDropdown"
                        value={selectedUser}
                        onChange={handleUserChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
                    >
                        <option value="">-- Select a User --</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.firstName} {user.lastName} - {user.email}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default PostVideocall;