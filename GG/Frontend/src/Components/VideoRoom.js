import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import Button from 'react-bootstrap/Button';
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom"; // Added useSearchParams

const APP_ID = '50a71f096ba844e3be400dd9cf07e5d4';  // Your Agora APP_ID
const TOKEN = '007eJxTYNAWDBERru4St+eKNtiq42z9nynQpfKaCPexXo47BXPL3igwmBokmhumGViaJSVamJikGielmhgYpKRYJqcZmKeapph0ffBJbwhkZHjDasrCyACBID43Q25iSXJGbmJ2Zl46AwMAuSseaw==';
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
            roomToken = '007eJxTYNjg/cbktOOB7d7CfnO9PEo/MwV+7Xjypajt7WJ9xhidrQsVGEwNEs0N0wwszZISLUxMUo2TUk0MDFJSLJPTDMxTTVNMln/1SW8IZGQw71dkYWSAQBCfjSEoPz9XwZGBAQC6JiAy';
        } else if (room === '2') {
            roomChannel = 'Room 2';
            roomToken = '007eJxTYODd1C2nx9Ef9S9rgv7k39pTfnk6bjz7hI312utFXivzpycrMJgaJJobphlYmiUlWpiYpBonpZoYGKSkWCanGZinmqaYrPzgk94QyMiwIuEKIyMDBIL4bAxB+fm5CkYMDACXiCCe';
        } else if (room === '3') {
            roomChannel = 'Room 3';
            roomToken = '007eJxTYPh6eW3PfVZTDxO2VYe0Tr/m+n1P9H0NR2Ch9Q3n0xMroyoVGEwNEs0N0wwszZISLUxMUo2TUk0MDFJSLJPTDMxTTVNM9n/1SW8IZGS4yj+RiZEBAkF8Noag/PxcBWMGBgDPBiC8';
        } else if (room === '4') {
            roomChannel = 'Room 4';
            roomToken = '007eJxTYNBU4fq27nfw40qpn69iBboei2VznGVfb8LNk9WlLP1DnkWBwdQg0dwwzcDSLCnRwsQk1Tgp1cTAICXFMjnNwDzVNMXkylef9IZARoZw7/dMjAwQCOKzMQTl5+cqmDAwAADqOh37';
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
        </div>
    );
};