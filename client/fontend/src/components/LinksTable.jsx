// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const LinksTable = () => {
//   const [links, setLinks] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchLinks = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/links'); // Replace with the correct API endpoint
//         setLinks(response.data); // Adjust based on your backend response format
//       } catch (err) {
//         setError('Error fetching links.');
//         console.error(err);
//       }
//     };

//     fetchLinks();
//   }, []);

//   return (
//     <div>
//       <h2>Uploaded and Cleaned Links</h2>
//       {error && <p>{error}</p>}
//       <table>
//         <thead>
//           <tr>
//             <th>Unique ID</th>
//             <th>Cleaned Links</th>
//             <th>Remarks</th>
//           </tr>
//         </thead>
//         <tbody>
//           {links.map((link) => (
//             <tr key={link.uniqueId}>
//               <td>{link.uniqueId}</td>
//               <td>{link.links.join(', ')}</td>
//               <td>{link.remarks.join(', ')}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LinksTable;





