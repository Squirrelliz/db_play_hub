import React from 'react';
import App from './App';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Header from "./Header";
import Footer from "./Footer";
import MainPage from "./MainPage";
import {Container} from "react-bootstrap";
import Profile from "./Profile";
import Awards from "./Awards";
import ModerPage from "./ModerPage";

window.onload = function() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <MainPage />
        },
        {
            path: "profile",
            element: <Profile />
        },
        {
            path: "award",
            element: <Awards />
        },
        {
            path: "moder",
            element: <ModerPage />
        }
    ]);

    createRoot(document.getElementById("root")).render(
        <>
            <Header></Header>
            <App />
            <RouterProvider router={router} />
            <Container></Container>
            <Footer></Footer>
        </>
    );
};

