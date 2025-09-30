import React from "react";
import "./styles.css";

const Input = ({ name, StylingClass,value,EnterKey,hint, required, type, onChangeListener }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={hint}
      value={value}
      className={StylingClass}
      required={required}
      onChange={onChangeListener}
      onKeyDown={EnterKey}
    />
  );
};

export default Input;