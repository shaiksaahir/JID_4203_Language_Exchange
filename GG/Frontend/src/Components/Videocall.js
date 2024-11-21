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

    const handleJoinRoom = () => {
        const selectedRoom = room.trim() || 'matchmaking'; // Default to "general" if no input
        console.log("Selected Room:", selectedRoom);
        setRoom(selectedRoom);
        setJoined(true);
    };

    return (
        <div className="screen-Background">
            <div className="call-container">
                <div className="screen-Content">
                    <h1>Video Call</h1>
                    {!joined && (
                        <>
                            <Button className='btn-join' onClick={handleJoinRoom}>
                                Join Room
                            </Button>
                            <div className="screen-Content">
                                <h5>Enter Room Number 1-4</h5>
                                <input
                                    placeholder="Enter"
                                    onChange={handleRoom} className="input"
                                    type="text" />
                            </div>
                        </>
                    )}
                    {joined && <VideoRoom room={room} />}
                </div>
                {/*<div className="screen-Content">*/}
                {/*    <h5>Enter Room Number 1-4</h5>*/}
                {/*    <input*/}
                {/*        placeholder="Enter"*/}
                {/*        onChange={handleRoom} className="input"*/}
                {/*        type="text" />*/}
                {/*</div>*/}
                <Button className="btn-help" onClick={handleBack} >back</Button>
            </div>
        </div>
    );
}

export default Videocall;