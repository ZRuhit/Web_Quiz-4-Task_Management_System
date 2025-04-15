import React from 'react';

const VerificationAlert = () => (
  <div style={alertStyle}>
    <h3>Verify Your Email</h3>
    <p>We've sent a verification link to your email address</p>
    <p>Please check your inbox and spam folder</p>
  </div>
);

const alertStyle = {
  padding: '20px',
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeeba',
  borderRadius: '4px',
  margin: '20px'
};

export default VerificationAlert;