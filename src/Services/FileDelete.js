import axios from "axios";

export const DeleteDocument= async({resource, documentName})=>{
    if (!resource && !documentName) {
        alert("No resource or document name provided for deletion!");
        return;
    }

    const response = await axios.post(
        "http://localhost:7071/api/ChatbotFunction/DeleteDocument",
        { resource:resource,
          DocumentName: documentName
         },
        { headers: { "Content-Type": "application/json" } }
    );

    console.log("Delete response:", response.data);
    

}