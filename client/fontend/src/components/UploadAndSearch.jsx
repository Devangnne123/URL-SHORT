import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const FileInputContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FileInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SearchInput = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  flex: 1;
  min-width: 200px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: #eee;
  margin: 2rem 0;
`;

const KeyDisplay = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const KeyLabel = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const KeyValue = styled.span`
  font-family: monospace;
  background: #e9ecef;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
`;

const RefreshButton = styled.button`
  background-color: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5a6268;
  }

  &:disabled {
    background-color: #d6d8db;
    cursor: not-allowed;
  }
`;

const UploadAndSearch = () => {
  const [file, setFile] = useState(null);
  const [searchUrl, setSearchUrl] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    message: 'Checking authentication...',
    valid: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authKey = localStorage.getItem('authKey');
      const authToken = localStorage.getItem('authToken');
      
      if (!authKey || !authToken) {
        setAuthStatus({
          loading: false,
          message: "❌ Unauthorized: Please login first",
          valid: false
        });
        setTimeout(() => window.location.href = "/", 2000);
        return;
      }

      try {
        // Verify with backend
        const response = await axios.post('http://13.232.220.117:8080/api/verify-auth', {
          key: authKey
        }, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (response.data.valid) {
          setAuthStatus({
            loading: false,
            message: "✅ Authorized",
            valid: true
          });
        } else {
          handleLogout();
        }
      } catch (error) {
        setAuthStatus({
          loading: false,
          message: "⚠️ Session expired or invalid",
          valid: false
        });
        handleLogout();
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authKey');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    window.location.href = "/";
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://13.232.220.117:8080/api/excel/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(res.data.message);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        alert('Upload failed: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchUrl.trim()) return;

    setIsSearching(true);
    try {
      const res = await axios.get(`http://13.232.220.117:8080/api/excel/search`, {
        params: { linkedin_url: searchUrl },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setSearchResult(res.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        alert('Search failed: ' + (error.response?.data?.message || error.message));
      }
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  if (authStatus.loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Verifying authentication...
        </div>
      </Container>
    );
  }

  if (!authStatus.valid) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          {authStatus.message}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#3498db', fontWeight: '600' }}>
          {authStatus.message}
        </div>
        <Button onClick={handleLogout} style={{ backgroundColor: '#e74c3c' }}>
          Logout
        </Button>
      </div>

      <KeyDisplay>
        <KeyLabel>Your Access Key:</KeyLabel>
        <KeyValue>{localStorage.getItem('authKey')?.slice(0, 12)}...</KeyValue>
      </KeyDisplay>

      {/* Rest of your component remains the same */}
      <Section>
        <SectionTitle>Excel Upload</SectionTitle>
        <FileInputContainer>
          <FileInput type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
          <Button onClick={handleFileUpload} disabled={!file || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </FileInputContainer>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Search by LinkedIn link</SectionTitle>
        <SearchContainer>
          <SearchInput
            type="text"
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
            placeholder="Enter LinkedIn URL"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </SearchContainer>

        {searchResult && (
          <div style={{ marginTop: '1rem', background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
            <h3>Search Result:</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(searchResult, null, 2)}
            </pre>
          </div>
        )}
      </Section>
    </Container>
  );
};

export default UploadAndSearch;
