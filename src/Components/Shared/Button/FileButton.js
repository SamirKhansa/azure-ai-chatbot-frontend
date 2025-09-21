import React from 'react';
import { handleUpload } from '../../../Services/FileUpload';
import { DeleteDocument } from '../../../Services/FileDelete';
import { UserDatabase } from '../../../Services/UserHandeling';

function FileButton({ Purpose, email,text, file, type, resource, docName, onSuccess, ClassNames, UploadedBy }) {
  const APICall = async () => {
    try {
      if (Purpose === "UploadDocument") {
        if (!file || !docName || !resource) {
          alert("Please provide file, document name, and resource");
          return;
        }

        const newDoc = await handleUpload(file, docName, type, resource, UploadedBy);

        if (onSuccess) onSuccess(newDoc);
      }

      if (Purpose === "DeleteDocument") {
        await DeleteDocument(resource);
        alert("Document deleted successfully");
      }

      if(Purpose=="Promote" || Purpose=="Denote" ||Purpose=="Delete"){
        UserDatabase(email=email, Purpose=Purpose)
      }
      

    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      alert("Action failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <button type="button" className={ClassNames} onClick={APICall}>
        {text}
      </button>
    </div>
  );
}

export default FileButton;
