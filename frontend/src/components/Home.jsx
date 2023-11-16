// Home.js

import React from 'react';
import '../styles/home.css'; // Import the CSS file
import AddExpense from '../pages/AddExpense';

const Home = () => {
  return (
    <div className="home-container">
      <h2>Welcome to Your Expense Tracker</h2>

      <section className="expense-section">
        <h3>Add Expenses</h3>
        <AddExpense/>
      </section>

      <section className="about">
        <h4>We also provide some advance features like leaderboard and expense reports for our premium members.</h4>
        {/* Add your leaderboard content or component here */}
      </section>

      
    </div>
  );
};

export default Home;
