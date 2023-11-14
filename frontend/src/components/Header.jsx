// Header.js
import React, { useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom'; // Assuming you're using React Router
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../contexts/actions/user';
import '../styles/header.css'
import { FaCrown } from 'react-icons/fa';
import ExpenseReport from './ExpenseReport';

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
    <Link to="/payment" id="premium-icon"><FaCrown className="premium-icon" style={{ color: 'gold', fontSize: '20px' }} />
</Link>
  </div>
  <div>
    <ul>
      <div><Link to="/all-expense">Expenses</Link></div>
        {isPremium && <div><Link to="/leader-board">Leader Board</Link></div>}
        {isPremium && <div><ExpenseReport token={token}/></div>}
    </ul>
  </div>
  <div>
    
    <button id="logout-button" onClick={handleLogout}>Logout</button>
  </div>
</header>

  );
};

export default Header;
