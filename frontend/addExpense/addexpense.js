document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expenseForm');

    const token = localStorage.getItem("access_token")
    

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
            expenseCategory,
        };
        console.log(expenseData)

        // Send a POST request to your backend API to add the expense using Axios
        axios.post('http://localhost:8800/expense/addExpense',expenseData,
        {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the JWT token in the "Authorization" header
                'Content-Type': 'application/json',
            },
        }    
        )
            .then(response => {
                // Handle the response from the backend (e.g., display a success message)
                console.log(response.data);
                alert('Expense added successfully');
                // You can redirect the user to another page if needed
                window.location.href = '../displayExpense/getexpenses.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while adding the expense');
            });
    });
});
