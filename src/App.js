import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import logo from './logo.svg';

import './App.css';
import Chat from "./Pages/Chat";
import Admin from "./Pages/Admin";
import Login from "./Pages/Login";
import Navbar from "./Components/Shared/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
