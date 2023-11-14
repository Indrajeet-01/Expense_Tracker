import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from "react-redux";
import store from "./contexts/store";
import Auth from "./pages/Auth";
import AddExpense from "./pages/AddExpense";
import AllExpenses from "./pages/AllExpense";
import Header from "./components/Header";
import Leaderboard from "./pages/LeaderBoard";
import BuyPremium from "./pages/BuyPremium";
import SendEmail from "./components/SendEmail";
import UpdatePassword from "./components/UpdatePassword";


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<AddExpense/>} /> 
          <Route path="/auth" element={<Auth/>} />
          
          <Route path="/all-expense" element={<AllExpenses/>} />
          <Route path="/leader-board" element={<Leaderboard/>} />
          <Route path="/buy-premium" element={<BuyPremium/>} />
          <Route path="/send-email" element={<SendEmail/>} />
          <Route path="/update-password" element={<UpdatePassword/>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
