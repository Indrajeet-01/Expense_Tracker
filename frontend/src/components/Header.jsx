// Header.js
import React, { useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom'; // Assuming you're using React Router
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../contexts/actions/user';
import '../styles/header.css'

const Header = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const isPremium = useSelector((state) => state.user.is_premium);
  const navigate = useNavigate()
 
   console.log(token)
  const handleLogout = () => {
    dispatch(logoutUser(token));
    // You can also redirect the user to the login page if needed
    navigate('/auth')
  };

  useEffect(() => {
    // Additional logic for checking premium status or any other actions
    // ...

    return () => {
      // Cleanup logic if needed
    };
  }, [token, dispatch]);

  return (
    <header>
  <div>
    <Link to="/home">Home</Link>
  </div>
  <div>
    <ul>
      <div><Link to="/all-expense">Expenses</Link></div>
      {isPremium && <div><Link to="/leaderboard">Leader Board</Link></div>}
        {isPremium && <div><button id="expense-report">Reports</button></div>}
    </ul>
  </div>
  <div>
    <Link to="/payment" id="premium-icon"><i className="fas fa-crown"></i></Link>
    <button id="logout-button" onClick={handleLogout}>Logout</button>
  </div>
</header>

  );
};

export default Header;
