import React, { useState, useEffect } from 'react';
import '../Styles/Admin.css';
import FileButton from '../Components/Shared/Button/FileButton';
import { handleUpload } from '../Services/FileUpload';
import Button from '../Components/Shared/Button';

const AdminPage = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resource, setResource] = useState("");
  const [docName, setDocName] = useState("");
  

  useEffect(() => {
    if (user?.adminData) {
      setUsers(user.adminData.users || []);
      setDocuments(user.adminData.documents || []);
    }
  }, [user]);

  // Callback after successful upload to update table and clear inputs
  const onUploadSuccess = (newDoc) => {
    setDocuments(prev => [...prev, newDoc]);
    setSelectedFile(null);
    setDocName("");
    setResource("");
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>

      <div className="admin-content">

        {/* Users Table */}
        <section className="admin-section">
          <h2>Users</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={index}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <FileButton 
                    text="Promote"
                    Purpose="Promote"
                    email={u.email}
                    ClassNames="promote-btn"
                    />
                    <FileButton 
                    text="Denote"
                    Purpose="Denote"
                    email={u.email}
                    ClassNames="demote-btn"
                    />
                    <FileButton 
                    text="Delete"
                    Purpose="Delete"
                    email={u.email}
                    ClassNames="delete-btn"
                    />
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Documents Table */}
        <section className="admin-section">
          <h2>Documents</h2>

          <input 
            type="text" 
            placeholder="Document Name"
            value={docName}
            onChange={(e) => setDocName(e.target.value)} 
          />

          <input 
            type="text" 
            placeholder="Resource URL"
            value={resource}
            onChange={(e) => setResource(e.target.value)} 
          />

          <input 
            type="file" 
            onChange={(e) => setSelectedFile(e.target.files[0])} 
          />

          <FileButton 
            Purpose="UploadDocument"
            text="Upload" 
            file={selectedFile}
            type={selectedFile?.type} 
            resource={resource} 
            docName={docName}
            UploadedBy={"Samir Khansa"}
            onSuccess={onUploadSuccess}
            ClassNames={"upload-btn"}
          />

          <table className="admin-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Resource</th>
                <th>Uploaded By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr key={index}>
                  <td>{doc.Name}</td>
                  <td>{doc.Type}</td>
                  <td>{doc.resource}</td>
                  <td>{doc.UploadedBy}</td>
                  <td>
                    <button className="view-btn">View</button>
                    <FileButton 
                      Purpose="DeleteDocument"
                      text="Delete" 
                      file={selectedFile}
                      type={selectedFile?.type} 
                      resource={doc.resource} 
                      ClassNames="delete-btn"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
};

export default AdminPage;
