import React, { useState } from 'react';
import axios from 'axios';

export default function AdminPanelForm() {
    const [coffee, setCoffee] = useState({
        name: '',
        price_small: 1.5,
        price_large: 2.5,
        price_grande: 3.5
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log('Input Changed:', name, value);
        setCoffee(prevCoffee => ({
            ...prevCoffee,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://comp464.ardapektezol.com/api/coffee', {
                coffee_name: coffee.name,
                prices: [coffee.price_small * 100, coffee.price_large * 100, coffee.price_grande * 100]
            });
            if (response.data.success) {
                alert(`Created new coffee ${coffee.name} successfully!`);
                console.log(response.data.data);
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            console.error('Admin failed:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-3">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={coffee.name}
                                onChange={handleChange}
                                placeholder="New Coffee Name"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>$ of Small</label>
                            <input
                                type="number"
                                className="form-control"
                                name="price_small"
                                value={coffee.price_small}
                                onChange={handleChange}
                                step={0.05}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>$ of Large</label>
                            <input
                                type="number"
                                className="form-control"
                                name="price_large"
                                value={coffee.price_large}
                                onChange={handleChange}
                                step={0.05}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>$ of Grande</label>
                            <input
                                type="number"
                                className="form-control"
                                name="price_grande"
                                value={coffee.price_grande}
                                onChange={handleChange}
                                step={0.05}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add New Coffee!</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
