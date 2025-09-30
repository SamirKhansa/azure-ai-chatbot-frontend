import { useLocation } from "react-router-dom";
import "./style.css";

export default function DocumentView() {
  const { doc } = useLocation().state || {};

  if (!doc) return <p className="doc-notfound">Document not found.</p>;

  return (
    <div className="document-view-container">
      <h1 className="document-header">{doc.documents}</h1>

      <div className="document-metadata">
        <p><strong>Uploaded by:</strong> {doc.UploadedBy}</p>
        <p><strong>Resource:</strong> {doc.Resource}</p>
        <p><strong>Type:</strong> {doc.Type}</p>
      </div>

      <div className="document-viewer">
        {doc.Content ? (
            <div className="document-content">
            {doc.Content}
            </div>
        ) : (
            <p>No content available</p>
        )}
        </div>
    </div>
  );
}
