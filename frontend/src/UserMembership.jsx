import React, { useState, useEffect } from 'react';
import './UserMembership.css';

const UserMembership = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duesPayment, setDuesPayment] = useState(0);
  const [feesPayment, setFeesPayment] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Decode the token to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        // Fetch user data
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (err) {
        setError('Failed to load user data. Please try again.');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDuesPayment = async (e) => {
    e.preventDefault();
    
    if (!duesPayment || duesPayment <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    try {
      const paymentAmount = Math.min(Number(duesPayment), user.membership_dues.amount);
      
      const updatedUser = {
        ...user,
        membership_dues: {
          ...user.membership_dues,
          amount: Math.max(0, user.membership_dues.amount - paymentAmount)
        }
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        throw new Error('Failed to update payment');
      }

      const data = await response.json();
      setUser(data);
      setDuesPayment(0);
      setSuccessMessage(`Successfully paid $${paymentAmount} for membership dues`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Error updating user:', err);
    }
  };

  const handleFeesPayment = async (e) => {
    e.preventDefault();
    
    if (!feesPayment || feesPayment <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    try {
      const totalFees = user.fees.overdue_fines + (user.fees.new_user_fee || 0);
      const paymentAmount = Math.min(Number(feesPayment), totalFees);
      
      // Calculate how much to apply to each fee type
      let remainingPayment = paymentAmount;
      let newOverdueFines = user.fees.overdue_fines;
      let newUserFee = user.fees.new_user_fee || 0;
      
      // First apply payment to overdue fines
      if (remainingPayment > 0 && newOverdueFines > 0) {
        const overduePayment = Math.min(remainingPayment, newOverdueFines);
        newOverdueFines -= overduePayment;
        remainingPayment -= overduePayment;
      }
      
      // Then apply remaining payment to new user fee if it exists
      if (remainingPayment > 0 && newUserFee > 0) {
        const newUserFeePayment = Math.min(remainingPayment, newUserFee);
        newUserFee -= newUserFeePayment;
        remainingPayment -= newUserFeePayment;
      }

      const updatedUser = {
        ...user,
        fees: {
          overdue_fines: newOverdueFines,
          ...(newUserFee > 0 ? { new_user_fee: newUserFee } : {})
        }
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        throw new Error('Failed to update payment');
      }

      const data = await response.json();
      setUser(data);
      setFeesPayment(0);
      setSuccessMessage(`Successfully paid $${paymentAmount} for fees`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Error updating user:', err);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
    </div>
  );

  if (error && !user) return (
    <div className="alert error">
      {error}
    </div>
  );

  if (!user) return (
    <div className="alert warning">
      No user data available.
    </div>
  );

  const totalFees = user.fees.overdue_fines + (user.fees.new_user_fee || 0);

  return (
    <div className="membership-container">
      <div className="membership-card">
        <div className="card-header">
          <h3>Membership & Fees</h3>
        </div>
        <div className="card-body">
          {successMessage && (
            <div className="alert success">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <div className="payment-sections">
            <div className="payment-card">
              <div className="payment-header">
                <h5>Membership Dues</h5>
              </div>
              <div className="payment-content">
                <div className="payment-info">
                  <span>Current Amount:</span>
                  <span className="amount">
                    ${user.membership_dues.amount.toFixed(2)}
                  </span>
                </div>
                <div className="payment-info">
                  <span>Due Date:</span>
                  <span>
                    {new Date(user.membership_dues.due_date).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="payment-info total">
                  <span>Total Due:</span>
                  <span className="amount">
                    ${user.membership_dues.amount.toFixed(2)}
                  </span>
                </div>
                
                {user.membership_dues.amount > 0 ? (
                  <form onSubmit={handleDuesPayment}>
                    <div className="form-group">
                      <label htmlFor="duesPayment">Payment Amount ($)</label>
                      <input
                        type="number"
                        id="duesPayment"
                        min="0"
                        max={user.membership_dues.amount}
                        step="0.01"
                        value={duesPayment}
                        onChange={(e) => setDuesPayment(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="payment-button">
                      Pay Membership Dues
                    </button>
                  </form>
                ) : (
                  <div className="alert success">
                    Your membership dues are paid in full!
                  </div>
                )}
              </div>
            </div>
            
            <div className="payment-card">
              <div className="payment-header">
                <h5>Fees & Fines</h5>
              </div>
              <div className="payment-content">
                {user.fees.overdue_fines > 0 && (
                  <div className="payment-info">
                    <span>Overdue Fines:</span>
                    <span className="amount">
                      ${user.fees.overdue_fines.toFixed(2)}
                    </span>
                  </div>
                )}
                
                {user.fees.new_user_fee && user.fees.new_user_fee > 0 && (
                  <div className="payment-info">
                    <span>New User Fee:</span>
                    <span className="amount">
                      ${user.fees.new_user_fee.toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="payment-info total">
                  <span>Total Due:</span>
                  <span className="amount">
                    ${totalFees.toFixed(2)}
                  </span>
                </div>
                
                {totalFees > 0 ? (
                  <form onSubmit={handleFeesPayment}>
                    <div className="form-group">
                      <label htmlFor="feesPayment">Payment Amount ($)</label>
                      <input
                        type="number"
                        id="feesPayment"
                        min="0"
                        max={totalFees}
                        step="0.01"
                        value={feesPayment}
                        onChange={(e) => setFeesPayment(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="payment-button">
                      Pay Fees
                    </button>
                  </form>
                ) : (
                  <div className="alert success">
                    You have no outstanding fees!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMembership;