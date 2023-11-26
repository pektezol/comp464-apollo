import OrderPanelForm from "../components/OrderPanelForm";
import Header from "../components/Header";

export default function OrderPanel() {
    return (
        <div id="order-panel">
            <Header />
            <OrderPanelForm />
        </div>
    );
}