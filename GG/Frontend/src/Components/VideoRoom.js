import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import Button from 'react-bootstrap/Button';
import translate from 'translate'; // imports the translate package that accesses the four different translation services that can be used in our program


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
  const [inputText, setInputText] = useState(''); // For handling input text
  const [savedText, setSavedText] = useState(''); // For saving the entered text

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

// Translation logic with language detection
const translateInput = async (text) => {
  try {
    // Detect if the text is in Korean or English using Javascript's regex.test(String) method of character detection
    const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text); // the regular expression used is the standard expression for detecting korean characters
    
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

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && inputText.trim() !== '') {

      const translatedText = await translateInput(inputText);

      setSavedText((prevText) => prevText + (prevText ? '\n' : '') + translatedText); // Append the input with a newline
      setInputText(''); // Clear the input field after saving
    }
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
  }, []);

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center',  whiteSpace: 'pre-wrap', }}
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

      {/* Add the input box for typing a message */}
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Type here and press Enter"
        style={{ marginTop: '20px', padding: '10px', width: '300px' }}
      />
      
      {/* Display the saved text */}
      {savedText && <p style={{ marginTop: '10px' }}>Saved input: {savedText}</p>}
    </div>
  );
};
