import AdminPanelForm from "../components/AdminPanelForm";
import Header from "../components/Header";

export default function AdminPanel() {
    return (
        <div id="admin-panel">
            <Header />
            <AdminPanelForm />
        </div>
    );
}