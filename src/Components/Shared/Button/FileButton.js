import React, { useState } from 'react';
import ChessLoader from '../LoadingPart';
import {APICall} from '../../../Services/Controllers'
import { useNavigate } from "react-router-dom";



function FileButton({ attribute}) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); 

  return (
    <div className={attribute.OutsideClass}>
      {loading && <ChessLoader />} {/* show loader */}
      <button type="button" className={attribute.ClassNames} onClick={() => APICall(attribute, setLoading, navigate)}>
        {attribute.text}
      </button>
    </div>
  );
}

export default FileButton;
