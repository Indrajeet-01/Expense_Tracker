import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from "react-redux";
import store from "./contexts/store";
import Auth from "./pages/Auth";
import AddExpense from "./pages/AddExpense";


function App() {
  return (
    <Provider store={store}>
      <Router>
        
        <Routes>
          <Route path="/auth" element={<Auth/>} />
          <Route path="/add-expense" element={<AddExpense/>} /> 
        </Routes>

      </Router>
      

    </Provider>
  );
}

export default App;
