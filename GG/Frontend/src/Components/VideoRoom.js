import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';

const APP_ID = 'your-app-id';  // Your Agora APP_ID
const TOKEN = 'your-agora-token';  // Agora token
const CHANNEL = 'test';

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});

export const VideoRoom = ({ selectedMic, videoOption }) => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [videoTrack, setVideoTrack] = useState(null);

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
    if (user.videoTrack) {
      user.videoTrack.stop();
      user.videoTrack.close();
    }
    if (user.audioTrack) {
      user.audioTrack.stop();
      user.audioTrack.close();
    }
  };

  // Manage video track based on "Show Video" or "Hide Video"
  useEffect(() => {
    const manageVideoTrack = async () => {
      if (videoOption === 'Show Video') {
        if (!videoTrack) {
          const cameraVideoTrack = await AgoraRTC.createCameraVideoTrack();
          setVideoTrack(cameraVideoTrack);
          client.publish([cameraVideoTrack]);
        }
      } else if (videoOption === 'Hide Video') {
        if (videoTrack) {
          client.unpublish([videoTrack]);
          videoTrack.stop();
          videoTrack.close();
          setVideoTrack(null);
        }
      }
    };

    manageVideoTrack();
  }, [videoOption]);  // Re-run when videoOption changes

  useEffect(() => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) => {
        AgoraRTC.createMicrophoneAudioTrack({ microphoneId: selectedMic }).then((audioTrack) => {
          client.publish([audioTrack]);
          setLocalTracks((prev) => [...prev, audioTrack]);
        });
      });

    return () => {
      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });
      client.leave();
    };
  }, [selectedMic]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 200px)',
          gap: '1rem',
        }}
      >
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};