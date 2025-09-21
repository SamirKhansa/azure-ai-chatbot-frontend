import React from 'react'
import "./style.css";
import { useNavigate } from "react-router-dom";
  

function Button({ OutsideClass,InsideClass, text, onClickListener }) {
  const navigate = useNavigate();
  return (
    
    <div className={OutsideClass}>
      <button className={InsideClass} onClick={onClickListener}>
      {text}
    </button>

    </div>
    
    
  );
  
}

export default Button