import logo from './logo.svg';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Login from './Pages/Website/Login';
import Register from './Pages/Website/Register';
import Home from './Pages/Dashboard/Homepage';
import Showusers from './Pages/Dashboard/User';
import DisplayUsers from './Pages/Dashboard/Userinfo';


function App() {
  return (
    <div className="App">
      <Routes>
     <Route path='/' element={<Home/>}></Route>   
    <Route path='/login' element={<Login/>} ></Route>
    <Route path='/register' element={<Register/>}></Route>
    <Route path='/users' element={<Showusers/>}></Route>
    <Route path='users/:id'element={<DisplayUsers/>}></Route>
   </Routes>
    </div>
  );
}

export default App;
