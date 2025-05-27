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

export default function App() {
  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Showusers />} />
        <Route path="/users/:id" element={<DisplayUsers />} />
        <Route path="/products" element={<ShowProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/articles" element={<ShowArticles />} />
        <Route path='/article/:id' element={<ArticleDetails/>}/>
      </Routes>
    </div>
  );
}
