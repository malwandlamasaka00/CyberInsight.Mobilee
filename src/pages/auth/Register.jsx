import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
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
            <div className="register-card">
                <h1>Create Account</h1>
                <p>Start securing your websites with CyberInsight</p>

                <form onSubmit={handleRegister}>
                    <input
                        name="name"
                        placeholder="First Name"
                        value={form.name}
                        onChange={update}
                    />

                    <input
                        name="surname"
                        placeholder="Surname"
                        value={form.surname}
                        onChange={update}
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={update}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={update}
                    />

                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={update}
                    />

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
    );
}

export default Register;