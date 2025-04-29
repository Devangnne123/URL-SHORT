import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaDownload } from 'react-icons/fa'; // ✅ Download icon
import './LinkTable.css'; // your custom styling

const LinksTable = () => {
  const [links, setLinks] = useState([]);
  const [masterUrls, setMasterUrls] = useState([]);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchedLink, setSearchedLink] = useState(null);
  const [matchedLinksForSearched, setMatchedLinksForSearched] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const linkResponse = await axios.get('http://localhost:5000/api/links');
        const masterUrlResponse = await axios.get('http://localhost:5000/api/master-urls');

        setLinks(linkResponse.data);
        setMasterUrls(masterUrlResponse.data);
      } catch (err) {
        setError('Error fetching links or master URLs.');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const checkIfMatch = (cleanLinks) => {
    if (!Array.isArray(cleanLinks)) {
      return { matchedLinks: [], matchedCount: 0 };
    }

    let matchedLinks = [];

    for (let masterUrl of masterUrls) {
      cleanLinks.forEach((cleanLink) => {
        if (cleanLink === masterUrl.clean_linkedin_link) {
          matchedLinks.push(cleanLink);
        }
      });
    }

    return { matchedLinks, matchedCount: matchedLinks.length };
  };

  const searchLinkById = async () => {
    if (!searchId) {
      setError('Please enter a unique ID to search.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/links/search/${searchId}`);
      const foundLink = response.data;
      setSearchedLink(foundLink);
      setError('');

      const { matchedLinks } = checkIfMatch(foundLink.clean_links);
      setMatchedLinksForSearched(matchedLinks);

    } catch (err) {
      setError('Error fetching link with the provided ID.');
      setSearchedLink(null);
      console.error(err);
    }
  };

  const downloadSearchedLinkAsExcel = () => {
    if (!searchedLink) {
      alert('No link found to download!');
      return;
    }

    const data = [
      {
        UniqueID: searchedLink.uniqueId,
        TotalLinks: searchedLink.totalLinks,
        OriginalLinks: searchedLink.links?.join(', '),
        CleanedLinks: searchedLink.clean_links?.join(', '),
        MatchedCleanedLinks: matchedLinksForSearched.join(', '),
        Remark: searchedLink.remark || '',
        MobileNumbers: searchedLink.mobile_numbers?.join(', '),
        PersonNames: searchedLink.person_names?.join(', '),
        PersonLocations: searchedLink.person_locations?.join(', '),
        MobileNumbers2: searchedLink.mobile_numbers_2?.join(', '),
        MatchedCount: searchedLink.matchedCount || 0,
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Link Details');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = `LinkDetails_${searchedLink.uniqueId}.xlsx`;

    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, fileName);
  };

  const downloadRowAsExcel = (link, matchedLinks) => {
    const data = [
      {
        UniqueID: link.uniqueId,
        TotalLinks: link.totalLinks,
        OriginalLinks: link.links?.join(', '),
        CleanedLinks: link.clean_links?.join(', '),
        MatchedCleanedLinks: matchedLinks.join(', '),
        Remark: link.remark || '',
        MobileNumbers: link.mobile_numbers?.join(', '),
        PersonNames: link.person_names?.join(', '),
        PersonLocations: link.person_locations?.join(', '),
        MobileNumbers2: link.mobile_numbers_2?.join(', '),
        MatchedCount: matchedLinks.length,
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Link Details');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = `LinkDetails_${link.uniqueId}.xlsx`;

    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, fileName);
  };

  return (
    <div>
      <h2>Uploaded and Cleaned Links + Mobile Details</h2>

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

      {/* Searched Data Section */}
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
                <th>Matched Cleaned Links</th>
                <th>Remarks</th>
                <th>Status (Matched?)</th>
                <th>Matched Count</th>
                <th>Mobile Numbers</th>
                <th>Person Names</th>
                <th>Person Locations</th>
                <th>Mobile Numbers 2</th>
              </tr>
            </thead>
            <tbody>
              <tr key={searchedLink.uniqueId}>
                <td>{searchedLink.uniqueId}</td>
                <td>{searchedLink.totalLinks}</td>
                <td>{searchedLink.links?.join(', ')}</td>
                <td>{searchedLink.clean_links?.join(', ')}</td>
                <td>{matchedLinksForSearched.join(', ')}</td>
                <td>{searchedLink.remark}</td>
                <td>{matchedLinksForSearched.length > 0 ? '✅ Match' : '❌ No Match'}</td>
                <td>{searchedLink.matchedCount}</td>
                <td>{searchedLink.mobile_numbers?.join(', ')}</td>
                <td>{searchedLink.person_names?.join(', ')}</td>
                <td>{searchedLink.person_locations?.join(', ')}</td>
                <td>{searchedLink.mobile_numbers_2?.join(', ')}</td>
              </tr>
            </tbody>
          </table>

          {/* Download Button for Searched Link */}
          <button onClick={downloadSearchedLinkAsExcel}>
            Download This Link's Details (Excel)
          </button>
        </div>
      )}

      {/* All Data Section */}
      <h3>All Links and Mobile Details</h3>
      <table>
        <thead>
          <tr>
            <th>Unique ID</th>
            <th>Total Links</th>
            <th>Original Links</th>
            <th>Matched Cleaned Links</th>
            <th>Remarks</th>
            <th>Status (Matched?)</th>
            <th>Matched Count</th>
            <th>Mobile Numbers</th>
            <th>Person Names</th>
            <th>Person Locations</th>
            <th>Mobile Numbers 2</th>
            <th>Download</th> {/* ✅ New */}
          </tr>
        </thead>
        <tbody>
          {links.map((link) => {
            const { matchedLinks, matchedCount } = checkIfMatch(link.clean_links);

            return (
              <tr key={link.uniqueId}>
                <td>{link.uniqueId}</td>
                <td>{link.totalLinks}</td>
                <td>{link.links?.join(', ')}</td>
                <td>{matchedLinks.join(', ')}</td>
                <td>{link.remark}</td>
                <td>{matchedLinks.length > 0 ? '✅ Match' : '❌ No Match'}</td>
                <td>{matchedCount}</td>
                <td>{link.mobile_numbers?.join(', ')}</td>
                <td>{link.person_names?.join(', ')}</td>
                <td>{link.person_locations?.join(', ')}</td>
                <td>{link.mobile_numbers_2?.join(', ')}</td>
                <td>
                  <button onClick={() => downloadRowAsExcel(link, matchedLinks)} title="Download Excel">
                    <FaDownload />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LinksTable;
