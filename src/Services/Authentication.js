
import axios from "axios";

  

export const LogIn= async({email, password, setUser}, navigate)=>{
    console.log(email+" emai then now password "+password)
    if (!email || !password) {
        console.log("No email or password provided!");
        return;
    }
    try{
        const response = await axios.post(
            "http://localhost:7071/api/ChatbotFunction/LogIn",{

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

        

        } 
        
        catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        alert("Login failed: " + (error.response?.data?.message || error.message));
        }
        
         
    

    

}








export const SignUp= async({Fullname, email, Password, ConfirmPassowrd}, navigate)=>{
    
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

        } 
    catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
        
        }


}









