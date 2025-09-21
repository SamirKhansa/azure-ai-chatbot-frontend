import React from "react";
import "./styles.css";

const Input = ({ name, hint, required, type,onChangeListener }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={hint}
      className="primary-input"
      required={required}
      onChange={onChangeListener}
    />
  );
};

export default Input;