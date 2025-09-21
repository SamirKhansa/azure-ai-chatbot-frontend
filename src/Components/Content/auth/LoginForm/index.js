import { useState } from "react";
import Input from "../../../Shared/Input";
import Button from "../../../Shared/Button";
import { useNavigate } from "react-router-dom";
import Switch from "../../../Shared/LoginRegisterSwitch";
import axios from "axios";
const LoginForm = ({ toggle , setUser}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="box">
        <h1 className="title">Login</h1>
        
        <p>email</p>
        <Input name="email" hint="example@gmail.com" icon="email" type="text" onChangeListener={(e) => setEmail(e.target.value)}
        />
        <p>Password</p>
        <Input name="password" hint="***********" icon="lock" type="password" onChangeListener={(e) => setPassword(e.target.value)}
        />

        <div className="options">
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <span className="forgot-password">Forgot password?</span>
        </div>
          
          
          

           <Button  OutsideClass={"button-container"} InsideClass={"primary-button"}
            text="Login"
            onClickListener={async () => {
              try {
                const response = await axios.post("http://localhost:7071/api/ChatbotFunction/LogIn", {
                  email: email,      
                  password: password,
                });

                
                console.log("Login successful:", response.data);

                
                localStorage.setItem("token", response.data.token);
                setUser({
                  role: response.data.role,
                  userId: response.data.userId,
                  adminData: response.data.adminData || null
                });
                if(response.data.role=="Admin"){
                  navigate("/dashboard/admin");
                }
                else{
                  navigate("/dashboard/Chat");
                }

                

              } catch (error) {
                console.error("Login error:", error.response?.data || error.message);
                alert("Login failed: " + (error.response?.data?.message || error.message));
              }
          }}
        />

        
       <Switch Text={"Don’t have an account?"} PageName={"Register"} toggle={toggle}/>
        
      </div>
    </div>
  );
};

export default LoginForm;
