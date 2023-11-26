export default function OrderCard({ props }) {

    let id = props.id;
    let customer = props.customer;
    let coffee_order = props.coffee_order;
    let creation_date = props.creation_date;
    let order_date = props.order_date;
    const total_price = coffee_order.reduce((total, currentOrder) => {
        return total + currentOrder.price / 100;
    }, 0);
    return (
        <div id={"coffee-order-" + props.id} className="container mt-3">
            <div className="row">
                <div className="col-3">
                </div>
                <div className="col-6 card">
                    <div className="row card">
                        <h4>Order ID: {id}</h4>
                    </div>
                    <div className="row card">
                        <h5>Customer:</h5>
                        <ul>
                            <li>Name: {customer.first_name} {customer.last_name}</li>
                            <li>User Name: {customer.user_name}</li>
                            <li>Email: {customer.email}</li>
                        </ul>
                    </div>
                    <div className="row card">
                        <h5>Coffee Order:</h5>
                        <ul>
                            {coffee_order.map((coffee_order, index) => (
                                <li key={index}>{coffee_order.name}, {coffee_order.size}, ${coffee_order.price / 100}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="row card">
                        <h6>Total: ${total_price.toFixed(2)}</h6>
                        {(creation_date !== order_date) ? (
                            <p>Ordered for Later: ({order_date.split("T")[0]}, {order_date.split("T")[1].split(".")[0].split("Z")[0]})</p>
                        ) : (
                            <p>Ordered for Now: ({order_date.split("T")[0]}, {order_date.split("T")[1].split(".")[0].split("Z")[0]})</p>
                        )}
                    </div>
                </div>
                <div className="col-3">
                </div>
            </div>
        </div>
    );
};