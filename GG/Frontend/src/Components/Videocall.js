import { useState, useEffect } from 'react';
import React from "react";
import './Videocall.css';
import { VideoRoom, client } from './VideoRoom';
import Button from 'react-bootstrap/Button';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";

function Videocall() {
    const [joined, setJoined] = useState();
    const [room, setRoom] = useState('');

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("id");

    const handleBack = async (e) => {
        if (!joined) {
            navigate({
                pathname: "/Dashboard",
                search: createSearchParams({
                    id: id
                }).toString()
            });
            console.log("to dashboard from call");
        } else {
            navigate({
                pathname: "/PostVideocall",
                search: createSearchParams({
                    id: id
                }).toString()
            });
            console.log("to post call page from call");
        }
    }

    const handleRoom = (e) => {
        setRoom(e.target.value);
    };

    function addParticipantToLocalStorage(participantId, roomName) {
        // Retrieve current data from local storage
        let participants = JSON.parse(localStorage.getItem('participantData')) || {};

        // Add or update participant's room information
        participants[participantId] = roomName;
        localStorage.setItem('participantData', JSON.stringify(participants));
    }

    const handleJoinRoom = () => {
        const selectedRoom = room.trim() || 'matchmaking'; // Default to 'matchmaking' if no input
        console.log("Selected Room:", selectedRoom);
        setRoom(selectedRoom);
        addParticipantToLocalStorage(id, selectedRoom);
        setJoined(true);
    };

    return (
        <div className="screen-Background">
            <div className="call-container">
                <div className="screen-Content">
                    <h1>Video Call</h1>
                    {!joined && (
                        <>
                            <div className="screen-Content">
                                <h5>Enter Room Number 1-4</h5>
                                <input
                                    placeholder="Enter"
                                    onChange={handleRoom} className="input"
                                    type="text" />
                            </div>
                            <button className='btn-back-02' onClick={handleJoinRoom}>
                                Join Room
                            </button>
                            <button className="btn-back-02" onClick={handleBack} >back</button>
                        </>
                    )}
                    {joined && <VideoRoom room={room} />}
                </div>
                
            </div>
        </div>
    );
}

export default Videocall;