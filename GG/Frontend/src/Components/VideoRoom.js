import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import translate from 'translate'; // imports the translate package that accesses the four different translation services that can be used in our program
import Button from 'react-bootstrap/Button';

const APP_ID = 'a6764cf8e2e146d5a2ed71c111c01b9a';
const TOKEN = '007eJxTYODL+LjX6uDyC5M4mr9mGAfI25WZfAv3PnnltVmkVY/vCl0FhkQzczOT5DSLVKNUQxOzFNNEo9QUc8NkQ0PDZAPDJMvEW7q5qQ2BjAzzVs1lZWSAQBCfhaEktbiEgQEAP7wfhA==';
const CHANNEL = 'test';

var mute = false;

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});

export const VideoRoom = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [videoTrack, setVideoTrack] = useState(null);
  const [inputText, setInputText] = useState(''); // For handling input text
  const [savedText, setSavedText] = useState(''); // For saving the entered text

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
    <div style={{ display: 'flex', justifyContent: 'center',  whiteSpace: 'pre-wrap', }}>
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
        }}
      >
        {savedText || 'No conversation yet...'}
      </div>
    </div>
  );
};
