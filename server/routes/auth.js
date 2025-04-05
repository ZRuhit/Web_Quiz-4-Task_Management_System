// In the login route handler, add login attempt limiting
const loginAttempts = new Map(); // Add at top of file

// Modify the login route
router.post('/login', [...], async (req, res) => {
    const { email } = req.body;
    
    // Add rate limiting (3 attempts per 15 minutes)
    if (loginAttempts.has(email) && loginAttempts.get(email) >= 3) {
        return res.status(429).json({ 
            msg: 'Too many attempts. Try again later.' 
        });
    }

    // ... existing code ...

    if (!isMatch) {
        loginAttempts.set(email, (loginAttempts.get(email) || 0) + 1);
        setTimeout(() => loginAttempts.delete(email), 15 * 60 * 1000); // 15 min
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Reset attempts on successful login
    loginAttempts.delete(email);
    // ... rest of existing code ...
});