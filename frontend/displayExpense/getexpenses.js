document.addEventListener('DOMContentLoaded', function () {
    const expenseTable = document.getElementById('expenseTable');
    const tbody = expenseTable.querySelector('tbody');

    const token = localStorage.getItem("access_token")

    // Send a GET request to fetch expenses from your backend API using Axios
    axios.get('http://localhost:8800/expense/displayExpenses',
    {
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        },
    } 
    )
        .then(response => {
            const expenses = response.data;

            console.log(expenses)

            // Loop through the expenses and create table rows
            expenses.forEach(expense => {
                const row = document.createElement('tr');
                const amountSpentCell = document.createElement('td');
                const expenseDescriptionCell = document.createElement('td');
                const expenseCategoryCell = document.createElement('td');

                amountSpentCell.textContent = expense.amount_spent;
                expenseDescriptionCell.textContent = expense.expense_description;
                expenseCategoryCell.textContent = expense.expense_category;

                row.appendChild(amountSpentCell);
                row.appendChild(expenseDescriptionCell);
                row.appendChild(expenseCategoryCell);

                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching expenses');
        });
});
