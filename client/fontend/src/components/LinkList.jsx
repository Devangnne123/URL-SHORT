import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LinkTable.css'; // your custom styling

const LinksTable = () => {
  const [links, setLinks] = useState([]);
  const [masterUrls, setMasterUrls] = useState([]);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchedLink, setSearchedLink] = useState(null); // To store the search result

  useEffect(() => {
    const fetchData = async () => {
      try {
        const linkResponse = await axios.get('http://localhost:5000/api/links');
        const masterUrlResponse = await axios.get('http://localhost:5000/api/master-urls'); // Fetch master URLs for comparison

        setLinks(linkResponse.data);
        setMasterUrls(masterUrlResponse.data); // Store master URLs
      } catch (err) {
        setError('Error fetching links or master URLs.');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Function to compare each link with master URLs
  const checkIfMatch = (cleanLinks, uniqueId) => {
    if (!Array.isArray(cleanLinks)) {
      return {
        matchedLinks: [],
        notMatchedLinks: [],
        matchedCount: 0,
      };
    }

    let matchedLinks = [];
    let notMatchedLinks = [];

    // Compare cleanLinks against master URLs
    for (let masterUrl of masterUrls) {
      cleanLinks.forEach((cleanLink) => {
        if (cleanLink === masterUrl.clean_linkedin_link) {
          matchedLinks.push(cleanLink);
        } else {
          notMatchedLinks.push(cleanLink);
        }
      });
    }

    // If there are matched links, send them to the backend
    if (matchedLinks.length > 0) {
      storeMatchedLinks(matchedLinks, uniqueId);
    }

    return {
      matchedLinks,
      notMatchedLinks,
      matchedCount: matchedLinks.length, // Count of matched links
    };
  };

  // Function to send matched links to the backend for storing in tempmobilelink
  const storeMatchedLinks = async (matchedLinks, uniqueId) => {
    try {
      await axios.post('http://localhost:5000/api/tempmobilelink', {
        uniqueId,
        matchedLinks,
      });
      console.log('Matched links stored successfully');
    } catch (err) {
      setError('Error storing matched links.');
      console.error(err);
    }
  };

  // Function to search link by uniqueId
  const searchLinkById = async () => {
    if (!searchId) {
      setError('Please enter a unique ID to search.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/links/search/${searchId}`);
      setSearchedLink(response.data);
      setError(''); // Clear error if successful
    } catch (err) {
      setError('Error fetching link with the provided ID.');
      setSearchedLink(null);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Uploaded and Cleaned Links</h2>
      
      {/* Search Section */}
      <div>
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Unique ID"
        />
        <button onClick={searchLinkById}>Search</button>
      </div>

      {error && <p>{error}</p>}

      {searchedLink && (
        <div>
          <h3>Search Result for Unique ID: {searchedLink.uniqueId}</h3>
          <table>
            <thead>
              <tr>
                <th>Unique ID</th>
                <th>Total Links</th>
                <th>Original Links</th>
                <th>Cleaned Links</th>
                <th>Remarks</th>
                <th>Status (Matched?)</th>
                <th>Matched Count</th>
              </tr>
            </thead>
            <tbody>
              {
                // Display the searched link only
                <tr key={searchedLink.uniqueId}>
                  <td>{searchedLink.uniqueId}</td>
                  <td>{searchedLink.totalLinks}</td>
                  <td>{searchedLink.links.join(', ')}</td>
                  <td>{searchedLink.clean_links.join(', ')}</td>
                  <td>{searchedLink.remark}</td>
                  <td>✅ Match</td>
                  <td>{searchedLink.matchedCount}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      )}

      {/* Default Links Table */}
      <h3>Matched Links</h3>
      <table>
        <thead>
          <tr>
            <th>Unique ID</th>
            <th>Total Links</th>
            <th>Original Links</th>
            <th>Cleaned Links</th>
            <th>Remarks</th>
            <th>Status (Matched?)</th>
            <th>Matched Count</th> {/* New column for matched count */}
          </tr>
        </thead>
        <tbody>
          {links.map((link) => {
            const { matchedLinks, notMatchedLinks, matchedCount } = checkIfMatch(link.clean_links, link.uniqueId);

            // Display only matched links
            return matchedLinks.length > 0 && (
              <tr key={link.uniqueId}>
                <td>{link.uniqueId}</td>
                <td>{link.totalLinks}</td>
                <td>{link.links.join(', ')}</td>
                <td>{matchedLinks.join(', ')}</td>
                <td>{link.remark}</td>
                <td>✅ Match</td>
                <td>{matchedCount}</td> {/* Display matched count */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LinksTable;
