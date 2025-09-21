import axios from "axios";

export const DeleteDocument= async(resource)=>{
    if (!resource) {
        alert("No resource provided for deletion!");
        return;
    }

    const response = await axios.post(
        "http://localhost:7071/api/ChatbotFunction/DeleteDocument",
        { resource },
        { headers: { "Content-Type": "application/json" } }
    );

    console.log("Delete response:", response.data);
    alert(`Deleted ${response.data.deleted_count} documents for resource: ${resource}`);

}