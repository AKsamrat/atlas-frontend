import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Login from "../pages/Login";

import DashboardHome from "../pages/dashboard/DashboardHome";

import Orders from "../pages/dashboard/Orders";
import Users from "../pages/dashboard/Users";
import CommonLayout from "../layouts/CommonLayouts";
import DashboardLayout from "../layouts/DashboardLayouts";
import Shope from "../pages/Shope";
import Product from "../pages/dashboard/Product";
import WeCare from "../pages/WeCare";
import OurBrand from "../pages/OurBrand";

import Contact from "../pages/Contact";
import Newsfeed from "../pages/NewsFeed";
import BusinessValue from "../pages/BusinessValue";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<CommonLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/WeCare" element={<WeCare />} />
                <Route path="/OurBrand" element={<OurBrand />} />
                <Route path="/shop" element={<Shope />} />
                <Route path="/BusinessValue" element={<BusinessValue />} />
                {/* <Route path="/category/:slug" element={<CategoryPage />} /> */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Newsfeed" element={<Newsfeed />} />
                <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="products" element={<Product />} />
                <Route path="orders" element={<Orders />} />
                <Route path="users" element={<Users />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;