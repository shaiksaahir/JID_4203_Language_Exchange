import { useState, useEffect } from 'react';
import React from "react";
import './Videocall.css';
import { VideoRoom } from './VideoRoom';
import Button from 'react-bootstrap/Button';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";

function Videocall() {
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const id = search.get("id");

  const [microphones, setMicrophones] = useState([]);
  const [selectedMic, setSelectedMic] = useState('');
  const [videoOption, setVideoOption] = useState('Hide Video'); // Default video option
  const [partners, setPartners] = useState(0);

  const handlePartners = (e) => {
      setPartners(parseInt(e.target.value) || 0);
  };

  useEffect(() => {
    async function getMicrophones() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        setMicrophones(audioDevices);
        if (audioDevices.length > 0) {
          setSelectedMic(audioDevices[0].deviceId); // Set default microphone
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    }
    getMicrophones();
  }, []);

  const handleMicChange = (e) => {
    setSelectedMic(e.target.value);
  };

  const handleVideoOptionChange = (e) => {
    setVideoOption(e.target.value);
  };

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
          {joined && (
            <VideoRoom
              selectedMic={selectedMic}
              videoOption={videoOption}  // Pass the video option
              partners={partners}
            />
          )}
        </div>

        {/*Chat Partners Section*/}
        <div className="screen-Content">
            <h5>Preferred Number of Chat Partners</h5>
            <input
                placeholder="Enter"
                onChange={handlePartners}
                className="input"
                type="text" />
        </div>

        {/* Preferences Wrapper at Bottom */}
        <div className="preferences-wrapper-bottom">
          {/* Audio Preferences Section */}
          <div className="audio-preferences half-width">
            <h3>Audio Preferences</h3>
            <div className="mute-section">
              <button className="mute-btn">Mute</button>
            </div>
            <div className="mic-selection">
              <label htmlFor="mic">Select Microphone:</label>
              <select id="mic" name="mic" value={selectedMic} onChange={handleMicChange}>
                {microphones.length > 0 ? (
                  microphones.map((mic) => (
                    <option key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || `Microphone ${mic.deviceId}`}
                    </option>
                  ))
                ) : (
                  <option>No microphones available</option>
                )}
              </select>
            </div>
          </div>

          {/* Video Preferences Section */}
          <div className="video-preferences half-width">
            <h3>Video Preferences</h3>
            <div className="mic-selection">
              <label htmlFor="video-options">Video Options:</label>
              <select
                id="video-options"
                name="video-options"
                value={videoOption}
                onChange={handleVideoOptionChange}
              >
                <option value="Hide Video">Hide Video</option>
                <option value="Show Video">Show Video</option>
              </select>
            </div>
          </div>
        </div>

        <Button className="btn-help" onClick={handleBack}>Back</Button>
      </div>
    </div>
  );
}

export default Videocall;