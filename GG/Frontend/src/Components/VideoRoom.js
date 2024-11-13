import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import Button from 'react-bootstrap/Button';
import { useNavigate, createSearchParams } from "react-router-dom";

const APP_ID = '50a71f096ba844e3be400dd9cf07e5d4';  // Your Agora APP_ID
const TOKEN = '007eJxTYEhY+l04kU1AXshIdL5r1PWsGy1V+5by9G56JpuxuIozvlCBwdQg0dwwzcDSLCnRwsQk1Tgp1cTAICXFMjnNwDzVNMVkxhfj9IZARgaNoxOYGBkgEMTnZshNLEnOyE3MzsxLZ2AAAHIpIGs='; 
const CHANNEL = 'matchmaking';

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});

export const VideoRoom = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [mute, setMute] = useState(false);
  const [hidden, setHidden] = useState(false);

  const navigate = useNavigate();

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
    if (user.videoTrack) user.videoTrack.close();
    if (user.audioTrack) user.audioTrack.close();
  };

  const handleMute = async () => {
    setMute((prevMute) => !prevMute);
    if (localTracks[0]) {
      await localTracks[0].setEnabled(!mute);
    }
  };

  const toggleHideVideo = async () => {
    setHidden((prevHidden) => !prevHidden);
    if (localTracks[1]) {
      await localTracks[1].setEnabled(!hidden);
    }
  };

  const handleEndCall = () => {
    // End call logic, if needed, such as stopping tracks or leaving the channel
    for (let localTrack of localTracks) {
      localTrack.stop();
      localTrack.close();
    }
    client.unpublish().then(() => client.leave());

    // Navigate to PostVideocall page
    navigate({
      pathname: "/PostVideocall",
      search: createSearchParams({
        id: "user_id" // Replace "user_id" with the actual ID if needed
      }).toString()
    });
  };

  useEffect(() => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) =>
        Promise.all([
          AgoraRTC.createMicrophoneAndCameraTracks(),
          uid,
        ])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks);
      });

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off('user-published', handleUserJoined);
      client.off('user-left', handleUserLeft);
      client.unpublish().then(() => client.leave());
    };
  }, [localTracks]);

  return (
    <div className="video-room-container">
      <div className="video-grid">
        {users.map((user) =>
          !hidden ? <VideoPlayer key={user.uid} user={user} /> : null
        )}
      </div>
      <Button className="btn-mute" onClick={handleMute}>
        {mute ? 'Unmute' : 'Mute'}
      </Button>
      <Button className="btn-hide" onClick={toggleHideVideo}>
        {hidden ? 'Show Video' : 'Hide Video'}
      </Button>
      <Button className="btn-end-call" onClick={handleEndCall}>
        End Call
      </Button>
    </div>
  );
};