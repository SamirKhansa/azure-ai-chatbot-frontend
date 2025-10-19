import { useState } from "react";
import Input from "../../../Shared/Input";
import FileButton from "../../../Shared/Button/FileButton";

import Switch from "../../../Shared/LoginRegisterSwitch";

const LoginForm = ({ toggle , setUser}) => {
  const [attributes, setAttrbutes]=useState({
      email: "",
      password:"",
    });
  

  return (
    <div className="container">
      <div className="box">
        <h1 className="title">Login</h1>
        
        <p>email</p>
        <Input name="email" hint="example@gmail.com" icon="email" type="text" ClassNames="primary-input" onChangeListener={(e) => setAttrbutes((prev)=>({
              ...prev,
              [e.target.name]: e.target.value
            }))}
        />
        <p>Password</p>
        <Input name="password" hint="***********" icon="lock" type="password" onChangeListener={(e) => setAttrbutes((prev)=>({
              ...prev,
              [e.target.name]: e.target.value
            }))}
        />

        <div className="options"> 
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <span className="forgot-password">Forgot password?</span>
        </div>
          


      <FileButton
      attribute={{
        Purpose:"LogIn",
        OutsideClass: "button-container",
        ClassNames:"primary-button",
        text:"Login",
        email: attributes.email,
        password: attributes.password,
        setUser:setUser

      }}
        
        />
           

        
       <Switch Text={"Don’t have an account?"} PageName={"Register"} toggle={toggle}/>
        
      </div>
    </div>
  );
};

export default LoginForm;
