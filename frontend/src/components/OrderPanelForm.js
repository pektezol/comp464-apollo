import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCookie, parseJwt } from './RequireAuth';

export default function OrderPanelForm() {
    const [coffeeList, setCoffeeList] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedCoffees, setSelectedCoffees] = useState([]);

    const [orderNow, setOrderNow] = useState(true);
    const [orderDate, setOrderDate] = useState('');
    const [orderTime, setOrderTime] = useState('');

    const [currentPage, setCurrentPage] = useState('selection');
    const [orderConfirmation, setOrderConfirmation] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://comp464.ardapektezol.com/api/coffee", {
            headers: {
                "Authorization": getCookie("token")
            }
        }).then((response) => {
            setCoffeeList(response.data.data.coffees);
        });
    }, []);
    if (!coffeeList) {
        return null;
    }

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
        setSelectedCoffees(Array(parseInt(e.target.value)).fill(''));
    };

    const handleCoffeeSelect = (index, sizeId) => {
        const updatedSelections = [...selectedCoffees];
        updatedSelections[index] = parseInt(sizeId);
        setSelectedCoffees(updatedSelections);
    };

    const generateOptions = (coffees) => {
        return coffees.flatMap(coffee =>
            coffee.sizes.map(size => ({
                label: `${coffee.name}, ${size.name}, $${(size.price / 100).toFixed(2)}`,
                value: size.id
            }))
        );
    };

    const handleOrderDateChange = (e) => {
        if (orderNow) {
            setOrderDate(e.target.value);
        } else {
            console.log(e.target.value)
            if (!orderTime) {
                setOrderTime("12:00:00")
                setOrderDate(new Date(e.target.value + 'T12:00:00').toISOString());
            } else {
                setOrderDate(new Date(e.target.value + 'T' + orderTime).toISOString());
            }
        }
    };

    const handleOrderTimeChange = (e) => {
        setOrderTime(e.target.value);
        if (orderDate) {
            setOrderDate(new Date(orderDate.split('T')[0] + 'T' + e.target.value).toISOString());
        }
    };

    const handleOrderTimeOptionChange = (e) => {
        setOrderNow(e.target.value === 'now');
        setOrderDate('');
        setOrderTime('');
    };

    const handleConfirmOrder = () => {
        setCurrentPage('confirmation');
    };

    const calculateTotalPrice = () => {
        return selectedCoffees.reduce((total, sizeId) => {
            const size = coffeeList.flatMap(coffee => coffee.sizes).find(size => size.id === parseInt(sizeId));
            return total + (size ? size.price : 0);
        }, 0);
    };

    const handleContinueOrderClick = () => {
        // Check if all coffees have been selected
        const allCoffeesSelected = selectedCoffees.every(coffee => coffee !== "");

        if (allCoffeesSelected && selectedCoffees.length !== 0) {
            setCurrentPage('orderTime');
        } else {
            alert('Please select a coffee for each item.');
        }
    };

    function placeOrder() {
        const orderData = {
            customer_email: parseJwt(getCookie("token")).sub,
            coffee_order: selectedCoffees,
            order_date: orderNow ? null : orderDate
        };
        console.log(orderData);
        axios.post('https://comp464.ardapektezol.com/api/order', orderData)
            .then(response => {
                const data = response.data;
                if (data.success) {
                    setOrderConfirmation(data.data.order_id);
                    setCurrentPage('thankYou');
                } else {
                    console.error('Order placement failed:', data.message);
                }
            })
            .catch(error => {
                console.error('Error placing order:', error);
            });
    };

    if (currentPage === 'thankYou') {
        return (
            <div className="container text-center mt-5 justify-content-center col-4">
                <h1 className="mb-3">Thank You for Your Order!</h1>
                <p>Your order ID is: {orderConfirmation}</p>
                <button className="btn btn-primary" onClick={() => navigate("/current-orders")}>OK</button>
            </div>
        );
    } else if (currentPage === 'confirmation') {
        const totalPrice = calculateTotalPrice();
        return (
            <div className="container mt-5 justify-content-center col-4">
                <h1 className="mb-4">Order Confirmation</h1>
                <ul className="list-group">
                    {selectedCoffees.map((sizeId, index) => {
                        const size = coffeeList.flatMap(coffee => coffee.sizes).find(size => size.id === parseInt(sizeId));
                        const coffee = coffeeList.find(coffee => coffee.sizes.includes(size));
                        return (
                            <li key={index}>
                                {coffee.name} - {size.name} - ${size.price / 100}
                            </li>
                        );
                    })}
                </ul>
                <p className="mt-3">Total Price: ${totalPrice / 100}</p>
                <p>Order Date: {orderNow ? 'Now' : orderDate}</p>
                <button className="btn btn-success" onClick={placeOrder}>Place Your Order</button>
            </div>
        );
    } else if (currentPage === 'orderTime') {
        return (
            <div className="container mt-5 justify-content-center col-4">
                <h1 className="mb-3">Order Time</h1>
                <div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="orderTimeOption"
                            value="now"
                            checked={orderNow}
                            onChange={handleOrderTimeOptionChange}
                        />
                        <label className="form-check-label">Now</label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="orderTimeOption"
                            value="later"
                            checked={!orderNow}
                            onChange={handleOrderTimeOptionChange}
                        />
                        <label className="form-check-label">Later</label>
                    </div>
                    {!orderNow && (
                        <div className="mt-3">
                            <div className="mb-3">
                                <label>Select Order Date: </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={orderDate.split('T')[0]}
                                    onChange={handleOrderDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label>Select Order Time: </label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={orderTime}
                                    onChange={handleOrderTimeChange}
                                />
                            </div>
                        </div>
                    )}
                    <button className="btn btn-primary mt-3" onClick={handleConfirmOrder}>Confirm Your Order</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 justify-content-center col-4">
            <h1 className="mb-3">Coffee Order</h1>
            <div className="mb-3">
                <label>How many coffees do you want? </label>
                <input
                    type="number"
                    className="form-control"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                />
            </div>
            {Array.from({ length: quantity }, (_, index) => (
                <div key={index} className="mb-3">
                    <label>Coffee {index + 1}: </label>
                    <select
                        className="form-select"
                        onChange={(e) => handleCoffeeSelect(index, e.target.value)}
                        value={selectedCoffees[index]}
                    >
                        <option value="">Choose a coffee</option>
                        {generateOptions(coffeeList).map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            ))}
            <button className="btn btn-primary" onClick={() => handleContinueOrderClick()}>Continue Order</button>
        </div>
    );
};
