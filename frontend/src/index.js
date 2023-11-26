import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
// Routes
import Home from './routes/Home';
import Register from './routes/Register'
import Login from './routes/Login';
import AdminPanel from './routes/AdminPanel';
import OrderPanel from './routes/OrderPanel';
import CurrentOrders from './routes/CurrentOrders';
// Components
import RequireAuth from './components/RequireAuth';
// Router
const router = createBrowserRouter([
  {
    path: "/",
    element:
      <RequireAuth>
        <Home />
      </RequireAuth>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/admin",
    element:
      <RequireAuth>
        <AdminPanel />
      </RequireAuth>
  },
  {
    path: "/order",
    element:
      <RequireAuth>
        <OrderPanel />
      </RequireAuth>
  },
  {
    path: "/current-orders",
    element:
      <RequireAuth>
        <CurrentOrders />
      </RequireAuth>
  },
  {
    path: "*",
    element:
      <h1>404 Not Found..</h1>
  }
]);
// Root
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
