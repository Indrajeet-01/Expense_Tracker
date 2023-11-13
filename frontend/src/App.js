import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from "react-redux";
import store from "./contexts/store";
import Auth from "./pages/Auth";
import AddExpense from "./pages/AddExpense";
import AllExpenses from "./pages/AllExpense";
import Header from "./components/Header";


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header/>
        <Routes>
          <Route path="/auth" element={<Auth/>} />
          <Route path="/add-expense" element={<AddExpense/>} /> 
          <Route path="/all-expense" element={<AllExpenses/>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
