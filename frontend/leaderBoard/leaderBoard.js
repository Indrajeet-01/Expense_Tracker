document.addEventListener('DOMContentLoaded', () => {
    const leaderboardBody = document.getElementById('leaderboard-body');

    const token = localStorage.getItem("access_token")

    // Fetch leaderboard data from the server using Axios
    axios.get('http://localhost:8800/user/leaderBoard',
    {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    )
        .then(response => {
            const data = response.data;

            // Iterate through the leaderboard data and create rows
            data.forEach((user, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.total_expense}</td>
                `;
                leaderboardBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching leaderboard data:', error));
});
