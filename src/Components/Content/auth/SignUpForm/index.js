import Button from "../../../Shared/Button";
import Input from "../../../Shared/Input";
import { useState } from "react";
import Switch from "../../../Shared/LoginRegisterSwitch";
import axios from "axios";
import FileButton from "../../../Shared/Button/FileButton";
import { useNavigate } from "react-router-dom";
const SignUpForm = ({ toggle }) => {
    
    const navigate = useNavigate();
    const [attributes, setAttrbutes]=useState({
      email: "",
      Fullname: "",
      Password:"",
      ConfirmPassowrd:"",
    });
    
    
  return (
    <div className="container">
          <div className="box">
            <h1 className="title">Register</h1>
            
            <p>Full Name</p>
            <Input name="Fullname" hint="eg. John Doe" icon="user" type="text" onChangeListener={(e) => setAttrbutes((prev)=>({
              ...prev,
              [e.target.name]: e.target.value
            }))}
            />
            <p>Email</p>
            <Input name="email" hint="eg. John Doe" icon="user" type="text" onChangeListener={(e) => setAttrbutes((prev)=>({
              ...prev,
              [e.target.name]: e.target.value
            }))}
            />
            <p>Password</p>
            <Input name="Password" hint="Enter a strong password" icon="lock" type="password" onChangeListener={(e) => setAttrbutes((prev)=>({
              ...prev,
              [e.target.name]: e.target.value
            }))}
            />
            <p>Cofirm Passowrd</p>
            <Input name="ConfirmPassowrd" hint="Re enter your password" icon="lock" type="password" onChangeListener={(e) => setAttrbutes((prev)=>({
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
            attribute={attributes}
            Purpose={"SignUp"}
            text={"SignUp"}
            InsideClass={"primary-button"}
            OutsideClass={"button-container"}
            />
            
            <Switch Text={"Already have an account?"} PageName={"LogIn"} toggle={toggle}/>
    
            
          </div>
        </div>
      );
};

export default SignUpForm;
