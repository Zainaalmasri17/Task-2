import { Routes, Route } from 'react-router-dom';


import Login from './Pages/Website/Login';
import Register from './Pages/Website/Register';
import Home from './Pages/Dashboard/Homepage';
import Showusers from './Pages/Dashboard/User';
import DisplayUsers from './Pages/Dashboard/Userinfo';
import ShowProducts from './Pages/Dashboard/products';
import ProductDetails from './Pages/Dashboard/ProductDetails';
import ShowArticles from './Pages/Dashboard/Articles';
import ArticleDetails from './Pages/Dashboard/ArticleDetails';
import Loginpage from './Pages/Dashboard/Loginpage';
import Favorites from './Pages/Dashboard/Favorites';
import Profile from './Pages/Dashboard/Profile';
import NotFound from './Pages/Dashboard/NotFound';
import CreatePost from './Pages/Dashboard/CreatePost';
import Dashboard from './Pages/Dashboard/Dashboard';
import EditPost from './Pages/Dashboard/EditPost';
import MainLayout from './Pages/Dashboard/Mainlayout';
import useTheme from './Pages/Dashboard/Usetheme';
import Notifications from './Pages/Dashboard/Notifications';
import AdminUsers from './Pages/Dashboard/AdminUsers';
import AdminReports from './Pages/Dashboard/AdminReports';

export default function App() {
  useTheme(); // 🌓 apply theme globally

  return (
    <MainLayout>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Showusers />} />
        <Route path="/users/:id" element={<DisplayUsers />} />
        <Route path="/products" element={<ShowProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Blog / Task Pages */}
        <Route path="/loginpage" element={<Loginpage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/articles" element={<ShowArticles />} />
        <Route path="/article/:id" element={<ArticleDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/admin/users' element={<AdminUsers />} />
        <Route path='/admin/reports' elemnt={<AdminReports/>}/>
        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}
