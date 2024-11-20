import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import Button from 'react-bootstrap/Button';
import { useNavigate, createSearchParams } from "react-router-dom";

const APP_ID = '50a71f096ba844e3be400dd9cf07e5d4';  // Your Agora APP_ID
const TOKEN = '007eJxTYHAvnsHy/o3/iukFLVElUaIv22+mXGhNmSr95+C2c3cjusMUGEwNEs0N0wwszZISLUxMUo2TUk0MDFJSLJPTDMxTTVNMJr+2TW8IZGSYxLaXmZEBAkF8bobcxJLkjNzE7My8dAYGANE0JDs=';
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

        var roomChannel = CHANNEL;
        var roomToken = TOKEN;

        if (room === '1') {
            roomChannel = 'Room A';
            roomToken = '007eJxTYKiZeue80dmVLBliOr/Na1o+ZTzRkeNmu/fsTI9voZxnmZQCg6lBorlhmoGlWVKihYlJqnFSqomBQUqKZXKagXmqaYqJNJtdekMgI8PfLcZMjAwQCOKzMQTl5+cqODIwAAA3Gh4z';
        } else if (room === '2') {
            roomChannel = 'Room 2';
            roomToken = '007eJxTYJDd9TB4+51lIiIaFxZbP/E5EFThdOHUuejHIbsPrHyWEPtCgcHUINHcMM3A0iwp0cLEJNU4KdXEwCAlxTI5zcA81TTFxIHNLr0hkJGB0/cWCyMDBIL4bAxB+fm5CkYMDAAWJiDQ';
        } else if (room === '3') {
            roomChannel = 'Room 3';
            roomToken = '007eJxTYLhym3nzEt5tZSJff1z2fP+t8kvgqfsp2xq27+RM5liloN2pwGBqkGhumGZgaZaUaGFikmqclGpiYJCSYpmcZmCeappiksdml94QyMhQqf2UkZEBAkF8Noag/PxcBWMGBgA2ryEV';
        } else if (room === '4') {
            roomChannel = 'Room 4';
            roomToken = '007eJxTYHh+4/+FwDmd05dvdbvTx2e9Vfk/w9nXaZP4XL7pFhpuWtSvwGBqkGhumGZgaZaUaGFikmqclGpiYJCSYpmcZmCeappi0spml94QyMgwfd4DRkYGCATx2RiC8vNzFUwYGAA46CGD';
        }

        console.log("room:", room);
        console.log("roomChannel:", roomChannel);
        console.log("Users in call: ", users);

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