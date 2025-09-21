import axios from "axios";

export const handleUpload = async (file, docName, type, resource, UploadedBy) => {
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
      name: docName,
      type: type,
      resource: resource,
      UploadedBy: UploadedBy
    };

  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    alert("Upload failed: " + (error.response?.data?.message || error.message));
    throw error;
  }
};
