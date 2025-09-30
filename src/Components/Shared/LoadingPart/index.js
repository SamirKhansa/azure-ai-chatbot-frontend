import React from "react";
import "./ChessLoaders.css";

export const ChessLoader = () => {
  return (
    <div className="chess-loader-overlay">
      <div className="chess-loader">
        <div className="chess-icon">♟</div>
        <p>Loading, please wait…</p>
      </div>
    </div>
  );
};

export default ChessLoader;
