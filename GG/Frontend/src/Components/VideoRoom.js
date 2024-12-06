import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import Button from 'react-bootstrap/Button';
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom"; // Added useSearchParams
import translate from 'translate';
import './VideoRoom.css';

const APP_ID = '50a71f096ba844e3be400dd9cf07e5d4';  // Your Agora APP_ID
const TOKEN = '007eJxTYOhhrnb9uYLpTaDLQwkDQ9vpG38Ufpk68XDbtiXpGz59ZAtQYDA1SDQ3TDOwNEtKtDAxSTVOSjUxMEhJsUxOMzBPNU0xeRcalN4QyMjw7tlCFkYGCATxuRlyE0uSM3ITszPz0hkYALNiJKE=';
const CHANNEL = 'matchmaking';

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
});

export const VideoRoom = ({ room }) => {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    const [mute, setMute] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [inputText, setInputText] = useState(''); // For user text input
    const [conversationText, setConversationText] = useState(''); // Stores translated conversation
    const [isTranslating, setIsTranslating] = useState(false);

    const navigate = useNavigate();
    const [search] = useSearchParams(); // Added useSearchParams
    const id = search.get("id"); // Extracted the user ID from the query parameters

    const handleUserJoined = async (user, mediaType) => {
        console.log("client.remoteUsers.length in handleUserJoined: ", client.remoteUsers.length);

        // Check the number of users before joining
        if (client.remoteUsers.length >= 2) {
            return;
        }

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
        setMute((prevMute) => {
            const newMute = !prevMute; // Toggle the mute state
            if (localTracks[0]) {
                if (newMute) {
                    client.unpublish(localTracks[0]).catch((error) => {
                        console.error("Error unpublishing audio track:", error);
                    });
                } else {
                    client.publish(localTracks[0]).catch((error) => {
                        console.error("Error publishing audio track:", error);
                    });
                }
            }
            return newMute; // Update the state
        });
    };

    const toggleHideVideo = async () => {
        if (!localTracks[1]) {
            console.error("Video track not initialized");
            return;
        }

        const newHidden = !hidden;

        if (newHidden) {
            // Stop publishing the video track (remove it for other users)
            await client.unpublish(localTracks[1]).catch((error) => {
                console.error("Error unpublishing video track:", error);
            });

            // Remove this user from the `users` list
            setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== client.uid));
        } else {
            // Start publishing the video track (re-add it for other users)
            await client.publish(localTracks[1]).catch((error) => {
                console.error("Error publishing video track:", error);
            });

            // Re-add this user to the `users` list
            setUsers((prevUsers) => [
                ...prevUsers,
                {
                    uid: client.uid,
                    videoTrack: localTracks[1],
                    audioTrack: localTracks[0],
                },
            ]);
        }

        setHidden(newHidden); // Update the `hidden` state
    };

    const handleEndCall = () => {
        // End call logic, if needed, such as stopping tracks or leaving the channel
        for (let localTrack of localTracks) {
            localTrack.stop();
            localTrack.close();
        }
        client.unpublish().then(() => client.leave());

        // Navigate to PostVideocall page with the user ID
        navigate({
            pathname: "/PostVideocall",
            search: createSearchParams({
                id: id // Pass the user ID from URL query parameters
            }).toString()
        });
    };

    const translateInput = async (text) => {
        try {
            setIsTranslating(true); // Indicate translation is in progress
            const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text); // Check if text is Korean
            const translatedText = isKorean
                ? await translate(text, { to: "en", from: "ko" })
                : await translate(text, { to: "ko", from: "en" });
            setIsTranslating(false); // Reset translation state
            return translatedText;
        } catch (error) {
            console.error("Translation failed:", error);
            setIsTranslating(false); // Reset on error
            return "Translation error. Please try again."; // Fallback message
        }
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && inputText.trim() !== '') {
            const translatedText = await translateInput(inputText); // Translate user input
            setConversationText((prevText) => prevText + (prevText ? '\n' : '') + translatedText); // Append to conversation
            setInputText(''); // Clear the input field
        }
    };

    useEffect(() => {
        const logElement = document.querySelector('.conversation-log');
        if (logElement) {
            logElement.scrollTop = logElement.scrollHeight;
        }
    }, [conversationText]);

    useEffect(() => {
        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);
        client.on('user-unpublished', (user, mediaType) => {
            if (mediaType === 'video') {
                setUsers((prevUsers) =>
                    prevUsers.filter((u) => u.uid !== user.uid)
                );
            }
        });

        var roomChannel = CHANNEL;
        var roomToken = TOKEN;

        if (room === '1') {
            roomChannel = 'Room A';
            roomToken = '007eJxTYKhW6z5Y3NLkvujEnWMuei6XFp39osQi+F/MW3L5xewZTe0KDKYGieaGaQaWZkmJFiYmqcZJqSYGBikplslpBuappikmeg5B6Q2BjAxVO6RZGRkgEMRnYwjKz89VcGRgAACJBB8q';
        } else if (room === '2') {
            roomChannel = 'Room 2';
            roomToken = '007eJxTYBA4Wzn1cYpx5YETbb1is2LnzG5cyFgdN2fidan7hseCF4cqMJgaJJobphlYmiUlWpiYpBonpZoYGKSkWCanGZinmqaYBDoEpTcEMjLwpbGwMjJAIIjPxhCUn5+rYMTAAACBMB6J';
        } else if (room === '3') {
            roomChannel = 'Room 3';
            roomToken = '007eJxTYIg1nCttfWbzr12fni0/Omt6SWn/P6EjYUwt4eGX0w05bHcqMJgaJJobphlYmiUlWpiYpBonpZoYGKSkWCanGZinmqaYpDsEpTcEMjJ8n8bFzMgAgSA+G0NQfn6ugjEDAwDWciAt';
        } else if (room === '4') {
            roomChannel = 'Room 4';
            roomToken = '007eJxTYLjpr5WadlVS50hBoPsXLn+zeQWnYiZXN93V0OhqmhC946wCg6lBorlhmoGlWVKihYlJqnFSqomBQUqKZXKagXmqaYpJvUNQekMgI8PtOl1mRgYIBPHZGILy83MVTBgYAD2eHsA=';
        }

        console.log("room:", room);
        console.log("roomChannel:", roomChannel);
        console.log("Users in call: ", users);
        console.log("client.remoteUsers: ", client.remoteUsers);

        client
            .join(APP_ID, roomChannel, roomToken, null)
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
    }, [room]);

    return (
        <div className="video-room-container">
            {/* Video Grid */}
            <div className="video-grid">
                {users.map((user) => (
                    <div key={user.uid} className="video-box">
                        <VideoPlayer user={user} />
                    </div>
                ))}
            </div>

            {/* Controls */}
            <button className="btn-mute" onClick={handleMute} >
                {mute ? 'Unmute' : 'Mute'}
            </button>
            <button className="btn-hide" onClick={toggleHideVideo}>
                {hidden ? 'Show Video' : 'Hide Video'}
            </button>
            <button className="btn-end-call" onClick={handleEndCall}>
                End Call
            </button>
            <div className="conversation-box">
                <div className="conversation-log">
                    {conversationText.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
            </div>
            {/* Text Input for Translation */}
            <div className="text-input-container">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message and press Enter"
                />
                {isTranslating && <p>Translating...</p>}
            </div>
        </div>
    );
};