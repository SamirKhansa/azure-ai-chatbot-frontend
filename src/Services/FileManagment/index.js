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


export const FileUpload = async ({file, docName, type, resource, UploadedBy}) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", docName);
    formData.append("resource", resource);
    formData.append("Type", type);
    formData.append("UploadedBy", UploadedBy);

    const response = await axios.post(
      "http://localhost:7071/api/ChatbotFunction/UploadDocument",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("File uploaded successfully!");

    // Return the new document to update AdminPage state
    return {
      documents: docName,
      Type: type,
      Resource: resource,
      UploadedBy: UploadedBy
    };

  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    alert("Upload failed: " + (error.response?.data?.message || error.message));
    throw error;
  }
};

// src/services/documentService.js


export const RetreivingContentOfDocument= async({name, resource}) =>{
  try {
    console.log("Name => "+name+" Now resource => "+resource);
    
    
    const response = await axios.post(
      "http://localhost:7071/api/ChatbotFunction/ViewDocument",

      {
        "name":name,
        "resource":resource
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error in from retreiving the content from documents:", error);
    throw error;
  }
}
