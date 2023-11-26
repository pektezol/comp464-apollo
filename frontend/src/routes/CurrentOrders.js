import { useState, useEffect } from 'react';
import Header from "../components/Header";
import axios from 'axios';
import OrderCard from '../components/OrderCard';
import { getCookie } from '../components/RequireAuth';


export default function CurrentOrders() {
    const [post, setPost] = useState(null);
    useEffect(() => {
        axios.get("https://comp464.ardapektezol.com/api/order", {
            headers: {
                "Authorization": getCookie("token")
            }
        }).then((response) => {
            if (!response.data.success) {
                alert("error while fetching backend")
            } else {
                setPost(response.data.data);
            }
        });
    }, []);
    if (!post) {
        return null;
    }
    return (
        <div id="current-orders">
            <Header />
            {post.map(post => (
                <OrderCard key={post.id} props={post} />
            ))}
        </div>
    );
};