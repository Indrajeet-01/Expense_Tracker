
import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux'
import axios from 'axios';
import '../styles/leaderBoard.css'

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector(state => state.user.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await axios.get('http://localhost:8800/user/leaderBoard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setLeaderboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setError(error.message || 'Something went wrong.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h1>Leaderboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Total Expense</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.total_expense}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
