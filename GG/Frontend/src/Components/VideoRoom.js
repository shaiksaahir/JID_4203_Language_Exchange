import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import Button from 'react-bootstrap/Button';

const APP_ID = '50a71f096ba844e3be400dd9cf07e5d4';  // Your Agora APP_ID
const TOKEN = '007eJxTYNgj/M41byOfxmHOe09nzpl180iSjUD3riNdCql71p1y3/ZCgcHUINHcMM3A0iwp0cLEJNU4KdXEwCAlxTI5zcA81TTFZCULc3pDICPD7YvyLIwMEAjiczPkJpYkZ+QmZmfmpTMwAACobCN7';  // Agora token
const CHANNEL = 'matchmaking';


var mute = false;

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});

export const VideoRoom = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

  var [hidden, setHidden] = useState(false)

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === 'audio') {
      user.audioTrack.play()
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
    user.videoTrack.close();
    user.audioTrack.close();
  };

  const handleMute = async(e) => {
    mute = !mute
    await localTracks[0].setEnabled(!mute)
  }

  const hide = async(e) => {
    hidden = !hidden
    console.log(hidden)
    await localTracks[1].setEnabled(!hidden)
  }

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
  }, []);

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 200px)',
        }}
      >
        {users.map((user) => (
          !hidden ? <VideoPlayer key={user.uid} user={user} /> : null
        ))}
      </div>
      <Button className="btn-mute" onClick={handleMute} >Mute</Button>
      <Button className="btn-hide" onClick={()=>setHidden(!hidden)} >Hide Video</Button>
    </div>
  );
};
