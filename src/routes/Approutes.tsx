import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";

import DashboardHome from "../pages/dashboard/DashboardHome";
import Employees from "../pages/dashboard/Employees";
import Attendance from "../pages/dashboard/Attendance";
import LeaveManagement from "../pages/dashboard/LeaveManagement";
import Departments from "../pages/dashboard/Departments";
import DailySubmissions from "../pages/dashboard/DailySubmissions";
import Subscribers from "../pages/dashboard/Subscribers";
import Payroll from "../pages/dashboard/Payroll";
import Orders from "../pages/dashboard/Orders";
import Users from "../pages/dashboard/Users";
import Customers from "../pages/dashboard/Customers";
import Inventory from "../pages/dashboard/Inventory";
import Accounts from "../pages/dashboard/Accounts";
import Expenses from "../pages/dashboard/Expenses";
import Salary from "../pages/dashboard/Salary";
import ServicesManager from "../pages/dashboard/content/ServicesManager";
import PartnersManager from "../pages/dashboard/content/PartnersManager";
import TestimonialsManager from "../pages/dashboard/content/TestimonialsManager";
import ContactManager from "../pages/dashboard/content/ContactManager";
import DomainPackagesManager from "../pages/dashboard/content/DomainPackagesManager";
import ServicePackagesManager from "../pages/dashboard/content/ServicePackagesManager";
import Settings from "../pages/dashboard/Settings";
import CommonLayout from "../layouts/CommonLayouts";
import DashboardLayout from "../layouts/DashboardLayouts";
import UserLayout from "../layouts/UserLayouts";
import UserDashboard from "../pages/user/UserDashboard";
import UserProfile from "../pages/user/UserProfile";
import UserAttendance from "../pages/user/UserAttendance";
import UserLeave from "../pages/user/UserLeave";
import UserSalary from "../pages/user/UserSalary";
import UserDailySubmission from "../pages/user/UserDailySubmission";
import CustomerLayout from "../layouts/CustomerLayouts";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerOrders from "../pages/customer/CustomerOrders";
import CustomerProfile from "../pages/customer/CustomerProfile";
import Shope from "../pages/Shope";
import Product from "../pages/dashboard/Product";
import WeCare from "../pages/WeCare";
import OurBrand from "../pages/OurBrand";

import Contact from "../pages/Contact";
import Newsfeed from "../pages/NewsFeed";
import BusinessValue from "../pages/BusinessValue";
import DomainHosting from "../pages/DomainHosting";
import WebDevelopment from "../pages/WebDevelopment";
import AboutUs from "../pages/AboutUs";
import TShirtDesign from "../pages/TShirtDesign";
import BrochureDesign from "../pages/BrochureDesign";
import FlyerDesign from "../pages/FlyerDesign";
import LogoBranding from "../pages/LogoBranding";
import FacebookMarketing from "../pages/FacebookMarketing";
import InstagramMarketing from "../pages/InstagramMarketing";
import LikesFollowers from "../pages/LikesFollowers";
import BoostedPostCampaigns from "../pages/BoostedPostCampaigns";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import HelpCenter from "../pages/HelpCenter";
import Blog from "../pages/Blog";
import ProtectedRoute from "./ProtectedRoute";

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
                <Route path="/domain-hosting" element={<DomainHosting />} />
                <Route path="/web-development" element={<WebDevelopment />} />
                <Route path="/about-us" element={<AboutUs />} />
                {/* Design sub-pages */}
                <Route path="/design/t-shirt" element={<TShirtDesign />} />
                <Route path="/design/flyer" element={<FlyerDesign />} />
                <Route path="/design/brochure" element={<BrochureDesign />} />
                <Route path="/design/logo-branding" element={<LogoBranding />} />
                {/* Digital Marketing sub-pages */}
                <Route path="/marketing/facebook" element={<FacebookMarketing />} />
                <Route path="/marketing/instagram" element={<InstagramMarketing />} />
                <Route path="/marketing/likes-followers" element={<LikesFollowers />} />
                <Route path="/marketing/boosted-posts" element={<BoostedPostCampaigns />} />
                {/* Legal & Support pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/blog" element={<Blog />} />
                {/* <Route path="/category/:slug" element={<CategoryPage />} /> */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/Newsfeed" element={<Newsfeed />} />
                <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Dashboard Routes — admin only */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardHome />} />
                <Route path="products" element={<Product />} />
                <Route path="orders" element={<Orders />} />
                <Route path="users" element={<Users />} />
                <Route path="employees" element={<Employees />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="leave" element={<LeaveManagement />} />
                <Route path="daily-submissions" element={<DailySubmissions />} />
                <Route path="departments" element={<Departments />} />
                <Route path="payroll" element={<Payroll />} />
                <Route path="customers" element={<Customers />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="salary" element={<Salary />} />
                {/* Website Content */}
                <Route path="content/services" element={<ServicesManager />} />
                <Route path="content/partners" element={<PartnersManager />} />
                <Route path="content/testimonials" element={<TestimonialsManager />} />
                <Route path="content/contact" element={<ContactManager />} />
                <Route path="content/domain-packages" element={<DomainPackagesManager />} />
                <Route path="content/service-packages" element={<ServicePackagesManager />} />
                <Route path="subscribers" element={<Subscribers />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* User Panel Routes — employees */}
            <Route path="/user" element={<ProtectedRoute allowedRoles={["user"]}><UserLayout /></ProtectedRoute>}>
                <Route index element={<UserDashboard />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="attendance" element={<UserAttendance />} />
                <Route path="leave" element={<UserLeave />} />
                <Route path="salary" element={<UserSalary />} />
                <Route path="daily-submission" element={<UserDailySubmission />} />
            </Route>

            {/* Customer Panel Routes */}
            <Route path="/customer" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerLayout /></ProtectedRoute>}>
                <Route index element={<CustomerDashboard />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="profile" element={<CustomerProfile />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;