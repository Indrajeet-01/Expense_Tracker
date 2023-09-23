document.addEventListener('DOMContentLoaded', function () {
    const expenseTable = document.getElementById('expenseTable');
    const tbody = expenseTable.querySelector('tbody');

    const token = localStorage.getItem("access_token")

    const itemsPerPage = 10;
    let currentPage = 1;

    // function to handle delete button
    const deleteExpense = (expenseId) => {
        // Send a DELETE request to delete the expense with the given ID
        axios.delete(`http://localhost:8800/expense/deleteExpense/${expenseId}`, 
        {
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

            const updateExpenseTable = () => {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;

                // Remove existing rows from the table
                while (tbody.firstChild) {
                    tbody.removeChild(tbody.firstChild);
                }

                // Create rows for the expenses on the current page
                expenses.slice(startIndex, endIndex).forEach(expense => {
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
                    row.id = `expenseRow_${expense.id}`;
                    row.appendChild(amountSpentCell);
                row.appendChild(expenseDescriptionCell);
                row.appendChild(expenseCategoryCell);
                row.appendChild(deleteButtonCell);
                    tbody.appendChild(row);
                });

                // Update the current page number display
                document.getElementById('currentPage').textContent = `Page ${currentPage}`;
            };

            // Function to toggle visibility of pagination buttons
            const togglePaginationVisibility = () => {
            const totalExpenses = expenses.length;
            const totalPages = Math.ceil(totalExpenses / itemsPerPage);

            document.getElementById('prevPage').style.display = (currentPage === 1 || totalExpenses === 0) ? 'none' : 'inline-block';

            document.getElementById('nextPage').style.display = (currentPage === totalPages || totalExpenses === 0) ? 'none' : 'inline-block';
            };
            // Event listener for "Next" button
            document.getElementById('nextPage').addEventListener('click', () => {
                if (currentPage < Math.ceil(expenses.length / itemsPerPage)) {
                    currentPage++;
                    updateExpenseTable();
                    togglePaginationVisibility();
                }
            });

            // Event listener for "Previous" button
            document.getElementById('prevPage').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateExpenseTable();
                    togglePaginationVisibility();
                }
            });

            // Initial table update
            updateExpenseTable();
            togglePaginationVisibility();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching expenses');
        });
});
