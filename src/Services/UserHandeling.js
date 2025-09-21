import axios from "axios";

export const UserDatabase = async (email, Purpose) => {
    if (!email) {
        alert("No email provided!");
        return;
    }

    try {
        const response = await axios.post(
            `http://localhost:7071/api/ChatbotFunction/${Purpose}`,
            { email },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log(`${Purpose} response:`, response.data);
        alert(`${Purpose} was implemented successfully`);
    } catch (error) {
        console.error(`Error during ${Purpose}:`, error);
        alert(`Failed to implement ${Purpose}. Check server logs.`);
    }
};
