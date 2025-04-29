import React, { useState } from 'react';
import axios from 'axios';

const UpdateLinkDetails = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [mobileNumbers, setMobileNumbers] = useState('');
  const [personNames, setPersonNames] = useState('');
  const [personLocations, setPersonLocations] = useState('');
  const [mobileNumbers2, setMobileNumbers2] = useState('');
  const [matchedLinks, setMatchedLinks] = useState([]);

  const handleFetchMatchedLinks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tempmobilelink/${uniqueId}`);
      console.log('API Response:', response.data);  // Add this line to inspect the response data

      // If matchedLinks exists, set it. Otherwise, show an empty array or handle it accordingly.
      setMatchedLinks(response.data.matchedLinks || []);

      // Prefill fields with existing data or empty if null
      setMobileNumbers(response.data.mobile_numbers ? response.data.mobile_numbers.join(', ') : '');
setPersonNames(response.data.person_names ? response.data.person_names.join(', ') : '');
setPersonLocations(response.data.person_locations ? response.data.person_locations.join(', ') : '');
setMobileNumbers2(response.data.mobile_numbers_2 ? response.data.mobile_numbers_2.join(', ') : '');

    } catch (error) {
      console.error('Error fetching matched links:', error.response?.data || error.message);
      alert('Failed to fetch matched links.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:5000/api/tempmobilelink/${uniqueId}/update-details`, {
        mobile_numbers: mobileNumbers ? mobileNumbers.split(',').map(item => item.trim()) : null,
        person_names: personNames ? personNames.split(',').map(item => item.trim()) : null,
        person_locations: personLocations ? personLocations.split(',').map(item => item.trim()) : null,
        mobile_numbers_2: mobileNumbers2 ? mobileNumbers2.split(',').map(item => item.trim()) : null,
      });

      console.log('Update successful:', response.data);
      alert('Details updated successfully!');
    } catch (error) {
      console.error('Error updating link details:', error.response?.data || error.message);
      alert('Failed to update details.');
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Update Link Details</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '400px' }}>
        
        <input
          type="text"
          placeholder="Unique ID"
          value={uniqueId}
          onChange={(e) => setUniqueId(e.target.value)}
          required
        />

        <button type="button" onClick={handleFetchMatchedLinks} style={{ padding: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Fetch Matched Links
        </button>

        {/* Display matched links if they exist */}
        {matchedLinks.length > 0 ? (
          <div>
            <h4>Matched Links:</h4>
            <ul>
              {matchedLinks.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div>No matched links found.</div>
        )}

        <textarea
          placeholder="Mobile Numbers (comma separated)"
          value={mobileNumbers}
          onChange={(e) => setMobileNumbers(e.target.value)}
          required
        />

        <textarea
          placeholder="Person Names (comma separated)"
          value={personNames}
          onChange={(e) => setPersonNames(e.target.value)}
          required
        />

        <textarea
          placeholder="Person Locations (comma separated)"
          value={personLocations}
          onChange={(e) => setPersonLocations(e.target.value)}
          required
        />

        <textarea
          placeholder="Second Mobile Numbers (comma separated)"
          value={mobileNumbers2}
          onChange={(e) => setMobileNumbers2(e.target.value)}
          required
        />

        <button type="submit" style={{ padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
          Submit Details
        </button>

      </form>
    </div>
  );
};

export default UpdateLinkDetails;
