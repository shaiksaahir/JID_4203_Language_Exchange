import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import translate from 'translate'; // imports the translate package that accesses the four different translation services that can be used in our program


const APP_ID = '50a71f096ba844e3be400dd9cf07e5d4';  // Your Agora APP_ID
const TOKEN = '007eJxTYNgj/M41byOfxmHOe09nzpl180iSjUD3riNdCql71p1y3/ZCgcHUINHcMM3A0iwp0cLEJNU4KdXEwCAlxTI5zcA81TTFZCULc3pDICPD7YvyLIwMEAjiczPkJpYkZ+QmZmfmpTMwAACobCN7';  // Agora token
const CHANNEL = 'matchmaking';

// const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// // Replace with your actual values
// const appID = "your-app-id";
// const appCertificate = "your-app-certificate";
// const channelName = "your-channel-name";
// const uid = 0; // Use 0 for allowing any user
// const role = RtcRole.PUBLISHER; // or RtcRole.SUBSCRIBER

// const expirationTimeInSeconds = 3600; // Set the token to expire in 1 hour (3600 seconds)
// const currentTimestamp = Math.floor(Date.now() / 1000);
// const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

// const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

// console.log("Generated Token:", token);

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});

export const VideoRoom = ({ selectedMic, videoOption, partners }) => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [videoTrack, setVideoTrack] = useState(null);
  const [inputText, setInputText] = useState(''); // For handling input text
  const [savedText, setSavedText] = useState(''); // For saving the entered text

  const handleUserJoined = async (user, mediaType) => {
    if (partners === 0 || users.length < partners) {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
            setUsers((previousUsers) => [...previousUsers, user]);
        }

        if (mediaType === 'audio') {
            user.audioTrack.play();
        }
    } else {
          console.log("User limit reached. Cannot join new users.");
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

    // Translation logic with language detection
    const translateInput = async (text) => {
      try {
        // Detect if the text is in Korean or English based on character set
        const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
        
        // Translate to English if it's in Korean, or to Korean if it's in English
        const translatedText = isKorean 
          ? await translate(text, { to: "en", from: "ko" }) 
          : await translate(text, { to: "ko", from: "en" });
  
        return translatedText;
      } catch (error) {
        console.error("Translation failed", error);
        return text; // Fallback to original text if translation fails
      }
    };
  
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && inputText.trim() !== '') {
      // Translate the input before appending
      const translatedText = await translateInput(inputText);

      // Append the translated input to the conversationText with a newline character
      setSavedText((prevText) => prevText + (prevText ? '\n' : '') + translatedText);
      setInputText(''); // Clear the input field after saving
    }
  };

  // const fetchNewToken = async () => {
  //   try {
  //     const response = await fetch("/api/agora-token", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         channelName: "your-channel-name",
  //       }),
  //     });
  //     const data = await response.json();
  //     return data.token;
  //   } catch (error) {
  //     console.error("Failed to fetch new token", error);
  //     return null;
  //   }
  // };

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

    // client.on('token-privilege-did-expire', async () => {
    //   // Handle token renewal here
    //   const newToken = await fetchNewToken(); // Fetch a new token from your server
    //   await client.renewToken(newToken); // Renew the token with Agora
    // });

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) => {
        AgoraRTC.createMicrophoneAudioTrack({ microphoneId: selectedMic }).then((audioTrack) => {
          client.publish([audioTrack]);
          setLocalTracks((prev) => [...prev, audioTrack]);
        });
      });

      // client
      // .join(APP_ID, CHANNEL, TOKEN, null)
      // .then((uid) => {
      //   AgoraRTC.createMicrophoneAudioTrack({ microphoneId: selectedMic }).then((audioTrack) => {
      //     client.publish([audioTrack]);
      //     setLocalTracks((prev) => [...prev, audioTrack]);
      //   });
      // })
      // .catch((error) => {
      //   console.error("Error joining the Agora channel:", error);
      // });

    return () => {
      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });
      client.leave();
    };
  }, [selectedMic, partners]);

  return (
    <div style={{ display: 'grid', placeItems: 'center',  whiteSpace: 'pre-wrap' }}>
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

       {/* Add the input box for typing a message */}
       <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}

        onKeyPress={handleKeyPress}
        placeholder="Type here and press Enter"
        style={{ marginTop: '20px', padding: '10px', width: '300px' }}
      />

      {/* Display the conversation */}
      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          border: '1px solid black',
          width: '300px',
          height: '150px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap', // Ensure newlines are displayed
          backgroundColor: '#f0f0f0',
          justifyContent: 'center', // Horizontally center
          alignItems: 'center',
          display: 'flex',
        }}
      >
        {savedText || 'No conversation yet...'}
      </div>

    </div>
  );
};