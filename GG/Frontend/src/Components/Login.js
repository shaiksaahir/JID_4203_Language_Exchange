import { useState } from 'react';
import './Login.scss';
import {handleLoginApi} from '../Services/userService';
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";

function Login (){
    let data;
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const navigate = useNavigate();
     const [errMsg ,setErrMsg] = useState('');

      // States for checking the errors
      const [submitted, setSubmitted] = useState(false);
      const [error, setError] = useState(false);


    const handleOnChangeUserInput = (event) => {
        setUsername(event.target.value);
        setSubmitted(false);
    }

    const handleOnChangePassword = (event) => {
       setPassword(event.target.value);
       setSubmitted(false);
    }

    const handleBack = () => {
        navigate({
          pathname: "/register", // Navigate to Registration page
        });
      };

//    const [search] = useSearchParams();
//    const id = search.get("id");
//    console.log(id)

    
    const handleOnClick = async() => {
        setErrMsg("");

        try{
            data = await handleLoginApi(username, password);
            console.log("check >>>>" , data.errorCode);
            if (data && data.errCode !== 0){
            setErrMsg(data.message);
            }
            if (data.errorCode == 0){
            console.log("I am")
            // todo when login successful!
            navigate({
                    pathname: "/Dashboard",
                    search: createSearchParams({
                        id: data.id
                    }).toString()
                });
            }
        }catch(error){
            if (error.response){
                if (error.response.data){
                    this.setState({
                        errMessage: error.response.data.message
                    })

                }
            }
        }
    }

    return (
        <div className="login-background">
          <div className="visual-section">
            {/* Add optional branding or visuals here */}
            Welcome Back!
          </div>
          <div className="login-container">
            <div className="login-content">
              <div className="text-login"><h1>Login</h1></div>
              <div className="login-input">
                <label>Username:</label>
                <input
                  placeholder="Enter your username"
                  value={username}
                  onChange={handleOnChangeUserInput}
                />
              </div>
              <div className="login-input">
                <label>Password:</label>
                <input
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleOnChangePassword}
                />
              </div>
              <div className="error-message">{errMsg}</div>
              <button className="btn-login" onClick={handleOnClick}>
                Login
              </button>
              <div
                className="register"
                style={{
                    color: "black",
                    cursor: "pointer",
                    fontWeight: "normal",
                    transition: "color 0.3s ease",
                }}
                onClick={handleBack}
                onMouseEnter={(e) => (e.target.style.color = "#6344A6")}
                onMouseLeave={(e) => (e.target.style.color = "black")}
                >
                Don't have an account? Register!
              </div>
            </div>
          </div>
        </div>
      );
      

}

export default Login;