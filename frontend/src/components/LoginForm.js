import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://comp464.ardapektezol.com/api/login', credentials);
            if (response.data.success) {
                alert("Logged in successfully!");
                document.cookie = "token=" + response.data.data + ";max-age=1209600;Secure;path=/";
                console.log(response.data.data);
                navigate("/");
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const navigateToRegister = () => {
        navigate('/register');
    };

    return (
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                    <h1 className="text-center">Apollo | Login</h1>
                    <form onSubmit={handleSubmit} class="form-group">
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="Email"
                            class="form-control mb-3"
                        />
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Password"
                            class="form-control mb-3"
                        />
                        <button type="submit" class="btn btn-primary w-100">Login</button>
                    </form>

                    <form onSubmit={navigateToRegister} class="text-center mt-4">
                        <p>Don't have an account?</p>
                        <button type="submit" class="btn btn-secondary w-100">Register Here</button>
                    </form>
                </div>
            </div>
        </div>

    );
};
