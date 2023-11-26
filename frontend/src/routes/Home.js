import Header from "../components/Header";

export default function Home() {
    return (
        <div id="home">
            <Header />
            <div className="container mt-5 text-center">
                <div className="row align-self-center">
                    <h1>Welcome to Apollo!</h1>
                    <h2>Here at Apollo, we provide the best coffee you can get your hands on!</h2>
                    <br />
                    <h3>We now support online ordering too! Just click on the 'Order Here' button at the top.</h3>
                    <br />
                    <h4>If you want to view the last 10 orders, click 'Current Orders'.</h4>
                    <h4>If you want to add new types of coffee to Apollo, go to the 'Admin Panel'.</h4>
                    <br />
                    <p>Made by Arda Serdar Pektezol. 042001037.</p>
                </div>
            </div>
        </div>
    );
};