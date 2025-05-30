import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { '*' : linkedinUrl } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Extracted LinkedIn URL:', linkedinUrl);

    const fetchProfile = async () => {
      try {
        // Clean the URL to ensure consistent format
        const cleanedUrl = linkedinUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const apiUrl = `http://65.0.19.161:5000/api/excel/search?linkedin_url=${cleanedUrl}`;
        console.log('Final API Request URL:', apiUrl);

        const response = await axios.get(apiUrl);
        console.log('Full API Response:', response); // Log entire response
        
        if (response.data.success) {
          console.log('Profile Data Received:', response.data.data);
          setProfile(response.data.data);
        } else {
          setError(response.data.message || 'Profile not found');
        }
      } catch (err) {
        console.error('Full Error:', err);
        console.error('Error Response:', err.response);
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (linkedinUrl) fetchProfile();
  }, [linkedinUrl]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
     
      {profile ? (
        <div>
          
          <pre>{JSON.stringify(profile, null, 2)}</pre> {/* Debug output */}
        </div>
      ) : (
        <p>No profile data found for: {linkedinUrl}</p>
      )}
    </div>
  );
};

export default Dashboard;