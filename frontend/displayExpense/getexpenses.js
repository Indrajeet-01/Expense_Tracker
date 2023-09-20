document.addEventListener('DOMContentLoaded', function () {
    const expenseTable = document.getElementById('expenseTable');
    const tbody = expenseTable.querySelector('tbody');

    // Send a GET request to fetch expenses from your backend API using Axios
    axios.get('/api/getExpense')
        .then(response => {
            const expenses = response.data;

            // Loop through the expenses and create table rows
            expenses.forEach(expense => {
                const row = document.createElement('tr');
                const amountSpentCell = document.createElement('td');
                const expenseDescriptionCell = document.createElement('td');
                const expenseCategoryCell = document.createElement('td');

                amountSpentCell.textContent = expense.amountSpent;
                expenseDescriptionCell.textContent = expense.expenseDescription;
                expenseCategoryCell.textContent = expense.expenseCategory;

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
