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
  const [userKey, setUserKey] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const userEmail = localStorage.getItem('userEmail');

  // Fetch user key on mount
  useEffect(() => {
    const fetchKey = async () => {
      try {
        const response = await axios.get('http://65.0.19.161:5000/api/user/key', {
          params: { email: userEmail },
        });
        setUserKey(response.data.key);
      } catch (error) {
        console.error('Failed to fetch key:', error);
      }
    };

    if (userEmail) {
      fetchKey();
    }
  }, [userEmail]);

  // Refresh key handler
  const handleRefreshKey = async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.post('http://65.0.19.161:5000/api/user/refresh-key', {
        email: userEmail,
      });
      setUserKey(response.data.newKey);
    } catch (error) {
      console.error('Failed to refresh key:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Upload Excel file
  const handleFileUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://65.0.19.161:5000/api/excel/upload', formData);
      alert(res.data.message);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Search LinkedIn URL
  const handleSearch = async () => {
    if (!searchUrl.trim()) return;

    setIsSearching(true);
    try {
      const res = await axios.get(`http://65.0.19.161:5000/api/excel/search`, {
        params: {
          linkedin_url: searchUrl,
        },
      });
      setSearchResult(res.data.data);
    } catch (error) {
      alert('LinkedIn URL not found');
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Container>
      {/* Welcome & Key Section */}
      {userEmail && (
        <>
          <div style={{ textAlign: 'right', marginBottom: '0.5rem', color: '#3498db', fontWeight: '600' }}>
            Welcome, {userEmail}
          </div>
          <KeyDisplay>
            <KeyLabel>Your Unique Key:</KeyLabel>
            <KeyValue>{userKey || 'Loading...'}</KeyValue>
            <RefreshButton onClick={handleRefreshKey} disabled={isRefreshing}>
              {isRefreshing ? 'Generating...' : 'Refresh Key'}
            </RefreshButton>
          </KeyDisplay>
        </>
      )}

      {/* Excel Upload Section */}
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

      {/* Search Section */}
      <Section>
        <SectionTitle>Search by LinkedIn link</SectionTitle>
        <SearchContainer>
          <SearchInput
            type="text"
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
            placeholder="Enter LinkedIn URL (e.g., https://linkedin.com/in/username)"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </SearchContainer>

        {searchResult && (
          <div>
            <h3>Search Result (JSON):</h3>
            <pre>{JSON.stringify(searchResult, null, 2)}</pre>
          </div>
        )}
      </Section>
    </Container>
  );
};

export default UploadAndSearch;
