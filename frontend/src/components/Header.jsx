
import React, { useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom'; 
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

  const handleLogout = () => {
    dispatch(logoutUser(token));
    // You can also redirect the user to the login page if needed
    navigate('/auth')
  };

  useEffect(() => {
    
    return () => {
      
    };
  }, [token, dispatch]);

  return (
    <header>
      <div>
        <Link to="/home">Home</Link>
      </div>
      <div>
      <ul>
        <div>
          <Link to="/payment" id="premium-icon"><FaCrown className="premium-icon" style={{ color: 'gold', fontSize: '20px' }} />Buy Premium
</Link>
        </div>
        <div><Link to="/all-expense">Expenses</Link></div>
        {isPremium && <div><Link to="/leader-board">Leader Board</Link></div>}
        {isPremium && <div><ExpenseReport token={token}/></div>}
      </ul>
    </div>
    <div>
      {token  ? (
        <button className="lg-button" onClick={handleLogout}>Logout</button>
      ) : (
        <Link className='lg-button' to='/auth'>Login</Link>
      )}
    
  </div>
</header>

  );
};

export default Header;
