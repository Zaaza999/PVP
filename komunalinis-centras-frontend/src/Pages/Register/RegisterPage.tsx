import React, { useState } from "react";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [form, setForm] = useState({
        FirstName: "",
        LastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5190/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    FirstName: form.FirstName,
                    lastname: form.LastName,
                    email: form.email,
                    password: form.password,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert("User registered successfully!");
            navigate("/login");
        } catch (error: any) {
            alert("Registration failed: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Registracija</h2>
                <form onSubmit={handleRegister} className="register-form">
                    <div className="form-group">
                        <label>Vardas</label>
                        <input
                            type="text"
                            name="FirstName"
                            value={form.FirstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Pavardė</label>
                        <input
                            type="text"
                            name="LastName"
                            value={form.LastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>El.Paštas</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Slaptažodis</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Patvirtinkite slaptažodį</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="register-button">
                        Atlikti registraciją
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
