import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed.');
    }
  };

  return (
    <div style={{ marginTop: "50px", textAlign: "center" }}>
      <h2>Upload Excel File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx, .xls" onChange={handleChange} />
        <br/><br/>
        <button type="submit">Upload</button>
      </form>
      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
}

export default UploadForm;
