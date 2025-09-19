import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/chat" style={{ marginRight: "10px" }}>Chat</Link>
      <Link to="/admin" style={{ marginRight: "10px" }}>Admin</Link>
      <Link to="/login">Login</Link>
    </nav>
  )
}

export default Navbar