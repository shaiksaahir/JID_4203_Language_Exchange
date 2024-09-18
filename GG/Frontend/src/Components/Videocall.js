import { useState } from 'react';
import React from "react";
import './Videocall.css';
import { VideoRoom } from './VideoRoom';
import Button from 'react-bootstrap/Button';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";

function Videocall() {
  const [joined, setJoined] = useState();
  const [partners, setPartners] = useState(0); // Combined both branches

  const navigate = useNavigate();
  const [search] = useSearchParams();
  const id = search.get("id");

  const handleBack = async (e) => {
    navigate({
      pathname: "/Dashboard",
      search: createSearchParams({
        id: id
      }).toString()
    });
  };

  const handlePartners = (e) => {
    setPartners(parseInt(e.target.value) || 0);
  };

  return (
    <div className="screen-Background">
      <div className="call-container">
        <div className="screen-Content">
          <h1>Video Call</h1>
          {!joined && (
            <Button className="btn-join" onClick={() => setJoined(true)}>
              Join Room
            </Button>
          )}
          {joined && <VideoRoom partners={partners} />}
        </div>

        <div className="screen-Content">
          <h5>Preferred Number of Chat Partners</h5>
          <input
            placeholder="Enter"
            onChange={handlePartners}
            className="input"
            type="text"
          />
        </div>

        {/* Audio Preferences Section */}
        <div className="audio-preferences">
          <h3>Audio Preferences</h3>
          <div className="mute-section">
            <button className="mute-btn">Mute</button>
          </div>
          <div className="mic-selection">
            <label htmlFor="mic">Select Microphone:</label>
            <select id="mic" name="mic">
              <option value="default">Default Microphone</option>
              <option value="mic1">Microphone 1</option>
              <option value="mic2">Microphone 2</option>
            </select>
          </div>
        </div>

        <Button className="btn-help" onClick={handleBack}>Back</Button>
      </div>
    </div>
  );
}

export default Videocall;
