import React, { useState } from "react";
import "./style.css";
import LoginForm from "../../Components/Content/auth/LoginForm";
import SignUpForm from "../../Components/Content/auth/SignUpForm";

const Auth = ({ setUser }) => {  // <-- accept setUser prop
  const [isLogin, setIsLogin] = useState(true);

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        {isLogin ? (
          <LoginForm toggle={switchForm} setUser={setUser} />  // <-- pass setUser
        ) : (
          <SignUpForm toggle={switchForm} />
        )}
      </div>
    </div>
  );
};

export default Auth;
