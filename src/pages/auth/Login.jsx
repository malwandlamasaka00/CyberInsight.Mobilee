// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import loginImage from "../../components/images/cyberiInsight.jpg";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await login(email, password);
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Left Panel - Image Cover */}
                <div className="login-left-panel">
                    <div className="left-panel-image" style={{ backgroundImage: `url(${loginImage})` }}></div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="login-right-panel">
                    <div className="login-card">
                        <div className="login-logo">
                            <span className="login-logo-icon"></span>
                            <h1>Welcome Back</h1>
                        </div>
                        <p className="subtitle">
                            Sign in to continue securing your websites
                        </p>

                        <form onSubmit={handleLogin}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <label>Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="toggle-btn"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {error && (
                                <p className="error">
                                    {error}
                                </p>
                            )}

                            <button
                                className="login-button"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <div className="register-link">
                            <p>Don't have an account?</p>
                            <Link to="/register">Create Account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;