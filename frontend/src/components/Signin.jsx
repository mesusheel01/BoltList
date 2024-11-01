import React, { useState } from 'react';
import axios from 'axios';
import Todo from './Todo';

const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/user/signin', { username, password });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                console.log(response.data.token);
                setIsSignedIn(true);
            } else {
                setError("Invalid credentials!");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred during Signing In.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {!isSignedIn ? (
                <div>
                    <form onSubmit={handleSignIn}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username..."
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password..."
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <Todo />
            )}
        </div>
    );
};

export default Signin;
