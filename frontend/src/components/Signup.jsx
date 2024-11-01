import React, { useState } from 'react';
import axios from 'axios';
import Signin from './Signin';

const   Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSignedUp, setIsSignedUp] = useState(false); // Change from const to state

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null)
        try {
            const response = await axios.post('http://localhost:3000/user/signup', { username, password });

            if (response.data.token) { // Assuming the token is in response.data
                localStorage.setItem("token", response.data.token); // Store token in localStorage
                alert('Signup successful');
                setIsSignedUp(true); // Update state to show Signin component
            }else{
                setError(response.data.msg)
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred during signup."); // Set an error message
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            { !isSignedUp ? (
                <div>
                    <form onSubmit={handleSignup}>
                        <input
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Enter your username...'
                            required
                        />
                        <input
                            type='password' // Set to password type
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter your password...'
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <Signin />
            )}
        </div>
    );
};

export default Signup;
