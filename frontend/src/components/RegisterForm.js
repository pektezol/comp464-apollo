import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterForm() {
    const [credentials, setCredentials] = useState(
        {
            first_name: '',
            last_name: '',
            user_name: '',
            email: '',
            password: ''
        }
    );

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
            const response = await axios.post('https://comp464.ardapektezol.com/api/register', credentials);
            if (response.data.success) {
                alert("Account registered successfully!")
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate("/login");
    }

    return (
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                    <h1 className="text-center">Apollo | Register</h1>
                    <form onSubmit={handleSubmit} class="form-group">
                        <input
                            type="text"
                            name="first_name"
                            value={credentials.first_name}
                            onChange={handleChange}
                            placeholder="First Name"
                            class="form-control mb-3"
                        />
                        <input
                            type="text"
                            name="last_name"
                            value={credentials.last_name}
                            onChange={handleChange}
                            placeholder="Last Name"
                            class="form-control mb-3"
                        />
                        <input
                            type="text"
                            name="user_name"
                            value={credentials.user_name}
                            onChange={handleChange}
                            placeholder="User Name"
                            class="form-control mb-3"
                        />
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
                        <button type="submit" class="btn btn-primary w-100">Register</button>
                    </form>

                    <form onSubmit={navigateToLogin} class="text-center mt-4">
                        <p>Already have an account?</p>
                        <button type="submit" class="btn btn-secondary w-100">Login Here</button>
                    </form>
                </div>
            </div>
        </div>

    );
};
