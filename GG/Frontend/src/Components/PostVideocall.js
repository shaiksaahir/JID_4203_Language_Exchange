import React, { useState, useEffect } from 'react';
import './Postvideocall.css';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { handleGetAllUsersApi } from '../Services/findFriendsService';
import Select from "react-select";
import { handleUpdateRating, handleUpdateProficiency, handleAddComment } from '../Services/userService';

function PostVideocall() {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("id");

    const [users, setUsers] = useState([]);
    const [chatPartnerId, setPartner] = useState(0);
    const [rating, setRating] = useState(0);
    const [targetLanguageProficiency, setTargetLanguageProficiency] = useState('');
    const [comment, setComment] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // For success messages

    const TargetLanguageProficiency = [
        { value: "Beginner", label: "Beginner" },
        { value: "Elementary", label: "Elementary" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Proficient", label: "Proficient" },
        { value: "Fluent", label: "Fluent" },
    ];

    useEffect(() => {
        const participants = JSON.parse(localStorage.getItem('participantData')) || {};
        console.log("Participants in the call:", participants);

        // Find the chat partner in the same room as the current user
        const currentRoom = participants[id];
        const chatPartnerId = Object.keys(participants).find(
            (key) => participants[key] === currentRoom && key !== id
        );

        setPartner(chatPartnerId || null); // Update state with chat partner's ID
        console.log("Chat Partner ID:", chatPartnerId);

        const fetchUsers = async () => {
            try {
                const userData = await handleGetAllUsersApi();
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [id]);
    
    const handleAddFriend = () => {
        const friend = users.find(user => String(user.id) === String(chatPartnerId));
        if (!friend) {
            console.error("No user found with chatPartnerId:", chatPartnerId);
            return;
        }

        const firstName = friend.firstName;
        const lastName = friend.lastName;

        const storedFriends = JSON.parse(localStorage.getItem('friendsList')) || [];
        const friendExists = storedFriends.some(
            f => f.firstName === firstName && f.lastName === lastName
        );

        if (!friendExists) {
            const updatedFriends = [...storedFriends, { firstName, lastName }];
            localStorage.setItem('friendsList', JSON.stringify(updatedFriends));
            console.log(`${firstName} ${lastName} added to friends list.`);
            setSuccessMessage('User has been Successfully Added to your Friends List');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } else {
            console.log(`${firstName} ${lastName} is already in your friends list.`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Submitting rating:", rating, "proficiency:", targetLanguageProficiency, "and comment:", comment, "for user ID:", chatPartnerId);
            
            // Update rating
            await handleUpdateRating(chatPartnerId, rating);
            console.log("Rating updated successfully.");

            // Update proficiency
            await handleUpdateProficiency(chatPartnerId, targetLanguageProficiency);
            console.log("Proficiency updated successfully.");

            // Add comment
            await handleAddComment(chatPartnerId, comment);
            console.log("Comment added successfully.");

            setSuccessMessage('Thanks for submitting a User Review!');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error("Failed to update rating, proficiency, or add comment:", error);
        }
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
        <div className="videocall-Background">
            <div className="videocall-container">
                <h2 className="feedback-title">Please Provide your Feedback!</h2>
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
                                className="form-group"
                                classNamePrefix="react-select"
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
                    <Button className="btn-back" onClick={handleBack}>Back</Button>
                    <Button className="btn-submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button className="btn-add-friend" onClick={handleAddFriend}>Add Friend</Button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="success-message">
                        <p>{successMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );    
}

export default PostVideocall;