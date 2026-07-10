// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import registerImage from "../../components/images/Cyber-securityheader.webp";
import "./Register.css";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const update = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (
            !form.name ||
            !form.surname ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError("Please fill in all fields");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        try {
            setLoading(true);
            await register(
                form.name,
                form.surname,
                form.email,
                form.password
            );
            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Unable to register"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                {/* Left Panel - Register Form */}
                <div className="register-left-panel">
                    <div className="register-card">
                        <div className="register-logo">
                            <span className="register-logo-icon"></span>
                            <h1>Create Account</h1>
                        </div>
                        <p className="subtitle">
                            Start securing your websites with Sentinel
                        </p>

                        <form onSubmit={handleRegister}>
                            <div className="input-group">
                                <label>First Name</label>
                                <input
                                    name="name"
                                    placeholder="Enter your first name"
                                    value={form.name}
                                    onChange={update}
                                />
                            </div>

                            <div className="input-group">
                                <label>Surname</label>
                                <input
                                    name="surname"
                                    placeholder="Enter your surname"
                                    value={form.surname}
                                    onChange={update}
                                />
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={update}
                                />
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Min 8 characters"
                                    value={form.password}
                                    onChange={update}
                                />
                            </div>

                            <div className="input-group">
                                <label>Confirm Password</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={form.confirmPassword}
                                    onChange={update}
                                />
                            </div>

                            {error && (
                                <p className="error">
                                    {error}
                                </p>
                            )}

                            <button disabled={loading}>
                                {loading ? "Creating..." : "Create Account"}
                            </button>
                        </form>

                        <div>
                            Already have an account?
                            <Link to="/login"> Sign In</Link>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Full Image Cover */}
                <div className="register-right-panel">
                    <div className="right-panel-image" style={{ backgroundImage: `url(${registerImage})` }}></div>
                </div>
            </div>
        </div>
    );
}

export default Register;