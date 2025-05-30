import React, { useState } from 'react';
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

const ResultContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 5px;
  border-left: 4px solid #3498db;
`;

const ResultTitle = styled.h3`
  margin-top: 0;
  color: #2c3e50;
`;

const Pre = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
  background: white;
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid #eee;
  max-height: 300px;
  overflow-y: auto;
`;

const UploadAndSearch = () => {
  const [file, setFile] = useState(null);
 const [searchUrl, setSearchUrl] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleFileUpload = async (e) => {
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

  const handleSearch = async () => {
    if (!searchUrl.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await axios.get(`http://65.0.19.161:5000/api/excel/search`, {
        params: {
          linkedin_url: searchUrl
        }
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
      <Section>
        <SectionTitle>Excel Upload</SectionTitle>
        <FileInputContainer>
          <FileInput 
            type="file" 
            accept=".xlsx" 
            onChange={e => setFile(e.target.files[0])} 
          />
          <Button 
            onClick={handleFileUpload} 
            disabled={!file || isUploading}
          >
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
        placeholder="Enter LinkedIn URL (e.g., https://linkedin.com/in/username)"
          />
          <Button 
            onClick={handleSearch} disabled={isSearching}>
            
        
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </SearchContainer>

       {searchResult && (
  <div>
    <h3>Search Result (JSON):</h3>
    <pre>
      {JSON.stringify(searchResult, null, 2)}
    </pre>
  </div>
)}
      </Section>
    </Container>
  );
};

export default UploadAndSearch;