import React from 'react'

function index({Text,PageName, toggle}) {
  return (
    <p className="switch">
        {Text}{" "}
        <span className="toggle" onClick={toggle}>
        {PageName}
        </span>
    </p>
  )
}

export default index