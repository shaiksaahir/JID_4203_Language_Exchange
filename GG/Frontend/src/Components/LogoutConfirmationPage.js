import React from "react";
import './LogoutConfirmationPage.scss';
import { handleGetUser, handleUserLogout } from '../Services/userService';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import logo from "../Styles/logo.png";
import Button from 'react-bootstrap/Button';

/**
Direct to Dashboard Page when onClick No
*/

function LogoutConfirmationPage() {
    let data;
    const navigate = useNavigate();

    const [search] = useSearchParams();
    const id = search.get("id");
    console.log('test ' + id);

    const ReturnDashboard = async (e) => {
        navigate({
            pathname: "/Dashboard",
            search: createSearchParams({
                id: id
            }).toString()
        });
    }

    const handleOnClick = async () => {
        try {
            data = await handleUserLogout(id);
            console.log("check" + data.errorCode);
            if (data.errorCode === 0) {
                // todo when logout successful!
                navigate({
                    pathname: "/",
                });
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    });
                }
            }
        }
    }

    return (
        <div className=" col-12 screen-Background">
            <div className="screen-Container" style={{ justifyContent: 'center' }}>
                <div className="screen-Content">
                    <h6>Are you sure you want to logout?</h6>
                    <div className="action_btn">
                        <Button className="btn-yes" onClick={handleOnClick}>Yes</Button>
                        <Button className="btn-no" onClick={ReturnDashboard}>No</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LogoutConfirmationPage;
