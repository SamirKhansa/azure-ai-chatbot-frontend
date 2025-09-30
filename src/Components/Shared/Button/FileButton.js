import React, { useState } from 'react';
import { handleUpload, RetreivingContentOfDocument } from '../../../Services/FileUpload';
import { DeleteDocument } from '../../../Services/FileDelete';
import { UserDatabase } from '../../../Services/UserHandeling';
import { LogIn, SignUp } from '../../../Services/Authentication';
import { useNavigate } from "react-router-dom";
import { handleSend, ClearHistory } from '../../../Services/Chat';
import ChessLoader from '../LoadingPart';
import {toggleRecording} from "../../../Services/AudioManagment"

function FileButton({ Purpose, attribute, text, file, type, resource, docName, 
  onSuccess, 
  ClassNames, 
  UploadedBy, 
  OutsideClass = NaN, 
  setUser 
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // loader state

  const APICall = async () => {
    setLoading(true); // show loader
    try {
      if (Purpose === "UploadDocument") {
        if (!file || !docName || !resource) {
          alert("Please provide file, document name, and resource");
          setLoading(false);
          return;
        }
        const newDoc = await handleUpload(file, docName, type, resource, UploadedBy);
        if (onSuccess) onSuccess(newDoc);
      } 
      else if (Purpose === "DeleteDocument") {
        const deletedDoc=await DeleteDocument(attribute.resource, attribute.DocumentName);
        if(onSuccess) onSuccess({
          "Resource":attribute.resource,
          "documents":attribute.DocumentName
        })
      } 
      else if (Purpose === "Promote" || Purpose === "Denote" || Purpose === "Delete") {
        console.log("this is the email " + attribute.email);
        await UserDatabase(attribute, Purpose = Purpose);
        if(Purpose=="Promote"){
          if(onSuccess) onSuccess(attribute.email,"Admin")
        }
        else{
          if(onSuccess) onSuccess(attribute.email,"User")
        }
          
      } 
      else if (Purpose === "LogIn") {
        await LogIn(attribute, setUser = setUser, navigate);
      } 
      else if (Purpose === "SignUp") {
        await SignUp(attribute, navigate);
      }
      else if(Purpose =="SendMessage"){
        await handleSend(attribute.input, attribute.setMessages, attribute.setInput, attribute.setLoading);
        
      }
      else if(Purpose=="MicButton"){
        await toggleRecording(attribute.isRecording, attribute.setIsRecording, attribute.audioContextRef, 
          attribute.recorderRef, attribute.setMessages, attribute.setLatestAudio, attribute.setLoading);
      }
      else if(Purpose=="View"){
        
       const doc= await RetreivingContentOfDocument(attribute.DocumentName, attribute.Resource, navigate)
       console.log(doc);
       
       if (doc) {
          navigate(`/dashboard/View`, { state: { doc } });
        } else {
          alert("Document not found.");
        }
       

      }

      else if(Purpose=="ClearHistory"){
        ClearHistory();
        if (onSuccess) onSuccess();

      }
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      alert("Action failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false); // hide loader
    }
  };

  return (
    <div className={OutsideClass}>
      {loading && <ChessLoader />} {/* show loader */}
      <button type="button" className={ClassNames} onClick={APICall}>
        {text}
      </button>
    </div>
  );
}

export default FileButton;
