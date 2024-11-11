import { useState, useEffect } from 'react';
import React from "react";
import './Videocall.css';
import { VideoRoom } from './VideoRoom';
import Button from 'react-bootstrap/Button';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";

function Videocall() {
  const [joined, setJoined] = useState();

  const navigate = useNavigate();
  const[search] = useSearchParams();
  const id = search.get("id");

  const handleBack = async(e) => {
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

  const [partners, setPartners] = useState('');
  const handlePartners = (e) => {
      setPartners(e.target.value);
  };

  return (
    <div className="screen-Background">
      <div className="call-container">
        <div className="screen-Content">
          <h1>Video Call</h1>
            {!joined && (
              <Button className='btn-join' onClick={() => setJoined(true)}>
                Join Room
              </Button>
            )}
            {joined && <VideoRoom />}
        </div>
        <div className="screen-Content">
            <h5>Prefered Number of Chat Partners</h5>
            <input
                placeholder="Enter"
                onChange={handlePartners} className="input"
                type="text" />
        </div>
        <Button className="btn-help" onClick={handleBack} >back</Button>
      </div>
    </div>
  );
}

export default Videocall;