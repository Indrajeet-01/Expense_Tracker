document.addEventListener('DOMContentLoaded', function () {
    const expenseTable = document.getElementById('expenseTable');
    const tbody = expenseTable.querySelector('tbody');

    const token = localStorage.getItem("access_token")

    // function to handle delete button
    const deleteExpense = (expenseId) => {
        // Send a DELETE request to delete the expense with the given ID
        axios.delete(`http://localhost:8800/expense/deleteExpense/${expenseId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.status === 200) {
                // Remove the row from the table if the expense was successfully deleted
                const rowToDelete = document.getElementById(`expenseRow_${expenseId}`);
                if (rowToDelete) {
                    rowToDelete.remove();
                }
            } else {
                alert('Failed to delete expense. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the expense.');
        });
    };

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
                row.id = `expenseRow_${expense.id}`
                const amountSpentCell = document.createElement('td');
                const expenseDescriptionCell = document.createElement('td');
                const expenseCategoryCell = document.createElement('td');
                const deleteButtonCell = document.createElement('td');

                amountSpentCell.textContent = expense.amount_spent;
                expenseDescriptionCell.textContent = expense.expense_description;
                expenseCategoryCell.textContent = expense.expense_category;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteExpense(expense.id);

                deleteButton.style.backgroundColor = 'red';
                deleteButton.style.color = 'white';

                deleteButtonCell.appendChild(deleteButton);

                row.appendChild(amountSpentCell);
                row.appendChild(expenseDescriptionCell);
                row.appendChild(expenseCategoryCell);
                row.appendChild(deleteButtonCell);

                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching expenses');
        });
});
