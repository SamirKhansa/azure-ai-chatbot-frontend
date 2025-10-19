import {toggleRecording} from '../AudioManagment'
import { FileUpload, RetreivingContentOfDocument } from '../FileManagment';
import { DeleteDocument } from '../FileDelete';
import { UserDatabase } from '../UserHandeling';
import { LogIn, SignUp } from '../Authentication';
import { handleSend, ClearHistory } from '../Chat';
import {FileAttributesExsist} from '../../helpers/FileFunctions'
import {OnSucessMultipleAttributes, OnSucessNoAttributes, OnSucessOneAttribute} from '../../helpers/OnSucess'
import {RolePromoteDenote} from '../../helpers/PromotionDenotion'
import {NavigateViewPage} from '../../helpers/Navigation'
import { handleMicClick } from '../../Utils/AudioHelperFunctions';


export const APICall = async (attribute, setLoading, navigate) => {
    
    setLoading(true); 
    const Purpose= attribute.Purpose;
    try {
      if (Purpose === "UploadDocument") {
        
        await FileAttributesExsist(attribute, setLoading);
        OnSucessOneAttribute(attribute, await FileUpload(attribute));
        
      }
      
      
      else if (Purpose === "DeleteDocument") {
        await DeleteDocument(attribute);
        const deletedDoc={
            "Resource": attribute.resource,
            "documents": attribute.DocumentName
        };   
        OnSucessOneAttribute(attribute, deletedDoc);
        
      } 

      else if (Purpose === "Promote" || Purpose === "Denote" || Purpose === "Delete") {
        await UserDatabase(attribute);
        OnSucessMultipleAttributes(attribute, await RolePromoteDenote(Purpose));
        
      } 

      else if (Purpose === "LogIn") {
        await LogIn(attribute, navigate);
      } 

      else if (Purpose === "SignUp") {
        await SignUp(attribute, navigate);
      }

      else if(Purpose =="SendMessage"){
        console.log(" The purpose is send Message");
        console.log(attribute+" this is the attribute value");
        await handleSend(attribute);
        
      }

      else if(Purpose=="MicButton"){
        await toggleRecording(attribute);
      }

      else if(Purpose=="View"){
        console.log("I am in the view then the purpose = View");
        NavigateViewPage(await RetreivingContentOfDocument(attribute), navigate)
      }

      else if(Purpose=="ClearHistory"){
        ClearHistory();
        OnSucessNoAttributes(attribute) 
      }
      else if(Purpose=="RealTimeChat"){
        handleMicClick(attribute);

      }

    } 
    
    catch (error) {
      console.error("API error:", error.response?.data || error.message);
      alert("Action failed: " + (error.response?.data?.message || error.message));
    } 
    
    finally {
      setLoading(false); // hide loader
    }
  };
