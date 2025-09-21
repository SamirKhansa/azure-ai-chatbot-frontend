import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, role, children }) => {
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

 
  if (role && user.role !== role) {
    
    return <Navigate to="/dashboard" replace />;
  }

  
  return <>{children}</>;
};

export default ProtectedRoute;
