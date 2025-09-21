import Button from "../../../Shared/Button";
import Input from "../../../Shared/Input";
import { useState } from "react";
import Switch from "../../../Shared/LoginRegisterSwitch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SignUpForm = ({ toggle }) => {
    const navigate = useNavigate();
    const [email, setEmail]=useState("");
    const [Fullname, setFullName]=useState("");
    const [Password, setPassowrd]=useState("");
    const [ConfirmPassowrd, setConfirmPassword]=useState("");
  return (
    <div className="container">
          <div className="box">
            <h1 className="title">Register</h1>
            
            <p>Full Name</p>
            <Input name="username" hint="eg. John Doe" icon="user" type="text" onChangeListener={(e) => setFullName(e.target.value)}
            />
            <p>Email</p>
            <Input name="username" hint="eg. John Doe" icon="user" type="text" onChangeListener={(e) => setEmail(e.target.value)}
            />
            <p>Password</p>
            <Input name="password" hint="Enter a strong password" icon="lock" type="password" onChangeListener={(e) => setPassowrd(e.target.value)}
            />
            <p>Cofirm Passowrd</p>
            <Input name="ConfirmPassword" hint="Re enter your password" icon="lock" type="password" onChangeListener={(e) => setConfirmPassword(e.target.value)}
            />
    
            <div className="options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <span className="forgot-password">Forgot password?</span>
            </div>
    
            <Button OutsideClass={"button-container"} InsideClass={"primary-button"}
              text="SignUp"
              onClickListener={async() => {
                try {
                    const response = await axios.post("http://localhost:7071/api/ChatbotFunction/SignUp", {
                      name: Fullname,
                      email: email,
                      password: Password,
                      password_confirmation: ConfirmPassowrd,
                      role: "User"
                    });

                    console.log("Registration successful:", response.data);
                    navigate("/Auth"); 

                  } catch (error) {
                    console.error("Registration error:", error.response?.data || error.message);
                   
                  }

                
              }}
            />
            <Switch Text={"Already have an account?"} PageName={"LogIn"} toggle={toggle}/>
    
            
          </div>
        </div>
      );
};

export default SignUpForm;
