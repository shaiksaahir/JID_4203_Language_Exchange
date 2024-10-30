import React, { useState, useEffect } from 'react';
import './Videocall.css';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

function PostVideocall() {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("id");

    const handleBack = async (e) => {
        navigate({
            pathname: "/Dashboard",
            search: createSearchParams({
                id: id
            }).toString()
        });
    };

    return (
        <div className="screen-Background">
            <div className="call-container">
                <Button className="btn-help" onClick={handleBack}>Back</Button>
            </div>
        </div>
    );
}

export default PostVideocall;