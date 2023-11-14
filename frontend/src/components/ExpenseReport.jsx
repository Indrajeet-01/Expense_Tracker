

import React from 'react';
import axios from 'axios';

const ExpenseReport = ({ token }) => {
  const handleGenerateReport = () => {
    axios
      .get('http://localhost:8800/user/generateReport', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: 'application/csv',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'expense_report.csv';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error('Error fetching report:', error));
  };

  return (
    <button onClick={handleGenerateReport}>
      Download Expense Report
    </button>
  );
};

export default ExpenseReport;
