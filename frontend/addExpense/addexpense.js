document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expenseForm');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    

    const token = getCookie("access_token")
    

    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const amountSpent = document.getElementById('amountSpent').value;
        const expenseDescription = document.getElementById('expenseDescription').value;
        const expenseCategory = document.getElementById('expenseCategory').value;

        // Create an object to hold the data
        const expenseData = {
            amountSpent,
            expenseDescription,
            expenseCategory
        };

        // Send a POST request to your backend API to add the expense using Axios
        axios.post('http://localhost:8800/expense/addExpense', expenseData,
        {
            headers: {
                'Authorization': `Bearer ${token}`, // Replace 'token' with the actual JWT token
                'Content-Type': 'application/json',
            }}
        )
            .then(response => {
                // Handle the response from the backend (e.g., display a success message)
                console.log(response.data);
                alert('Expense added successfully');
                // You can redirect the user to another page if needed
                // window.location.href = '/displayExpenses.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while adding the expense');
            });
    });
});
