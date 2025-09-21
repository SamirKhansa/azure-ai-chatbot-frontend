import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import "./App.css";

// Pages
import Auth from "./Pages/Auth";
import Dashboard from "./Pages/Dashboard";
import Admin from "./Pages/Admin";
import Chat from "./Pages/Chat";

// Components
import Navbar from "./Components/Shared/Navbar";


import ProtectedRoute from "./ProtectedRoutes";

function App() {
  const [user, setUser] = useState(null); // Global user state

  return (
    <Router>
      <Routes>
        
        <Route path="/auth" element={<Auth setUser={setUser} />} />

        
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute user={user}>
              <Navbar />
              <Routes>
                <Route index element={<Dashboard />} />

                
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute user={user} role="Admin">
                      <Admin user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* User-only route */}
                <Route
                  path="chat"
                  element={
                    <ProtectedRoute user={user} role="User">
                      <Chat user={user} />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </ProtectedRoute>
          }
        />

        
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
