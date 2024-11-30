import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import Button from 'react-bootstrap/Button';
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom"; // Added useSearchParams

const APP_ID = '50a71f096ba844e3be400dd9cf07e5d4';  // Your Agora APP_ID
const TOKEN = '007eJxTYBBZtHBJlGlLn0j3x80P/ylMucl+alOUfcuNQNu8aRNePv2rwGBqkGhumGZgaZaUaGFikmqclGpiYJCSYpmcZmCeappi4p/pld4QyMiwUG0lKyMDBIL43Ay5iSXJGbmJ2Zl56QwMAM5aI/I=';
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
    
        // Navigate to PostVideocall page with the user ID
        navigate({
            pathname: "/PostVideocall",
            search: createSearchParams({
                id: id // Pass the user ID from URL query parameters
            }).toString()
        });
    };

    useEffect(() => {
        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);

        var roomChannel = CHANNEL;
        var roomToken = TOKEN;

        if (room === '1') {
            roomChannel = 'Room A';
            roomToken = '007eJxTYBDKWfVs3lc3/SuS8Y9das/OFZZa9T7mYfma5a/L7wo+O8qvwGBqkGhumGZgaZaUaGFikmqclGpiYJCSYpmcZmCeappikp/pld4QyMiw791LVkYGCATx2RiC8vNzFRwZGAAiKCJD';
        } else if (room === '2') {
            roomChannel = 'Room 2';
            roomToken = '007eJxTYGhcsSHzxFslc5l9KZFGEc1syV0z48VNzmtWv3EuXB7gVq3AYGqQaG6YZmBplpRoYWKSapyUamJgkJJimZxmYJ5qmmLSkumV3hDIyLCH4TQLIwMEgvhsDEH5+bkKRgwMAANEHeg=';
        } else if (room === '3') {
            roomChannel = 'Room 3';
            roomToken = '007eJxTYFDsv+LMF/97evdf79a6xBdcBtP1jrqG5ZoIP8wJeeXIdkOBwdQg0dwwzcDSLCnRwsQk1Tgp1cTAICXFMjnNwDzVNMVkfqZXekMgI4OC/BcWRgYIBPHZGILy83MVjBkYADL7Hl0=';
        } else if (room === '4') {
            roomChannel = 'Room 4';
            roomToken = '007eJxTYAiavsWaydM28vXUJOO8iB/ujmYxn0tOb913Vrg0JU7JoVKBwdQg0dwwzcDSLCnRwsQk1Tgp1cTAICXFMjnNwDzVNMXkYKZXekMgI8OU6T2sjAwQCOKzMQTl5+cqmDAwAAAbfx6g';
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