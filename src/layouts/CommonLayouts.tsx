

import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import Topbar from "../components/shared/Topbar";

const CommonLayout = () => {
    return (
        <>
            <Topbar />
            <Navbar />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default CommonLayout;