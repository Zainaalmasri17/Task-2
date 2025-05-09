import logo from './logo.svg';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Login from './Pages/Website/Login';
import Register from './Pages/Website/Register';
import Home from './Pages/Dashboard/Homepage';


function App() {
  return (
    <div className="App">
      <Routes>
     <Route path='/' element={<Home/>}></Route>   
    <Route path='/login' element={<Login/>} ></Route>
    <Route path='/register' element={<Register/>}></Route>
   </Routes>
    </div>
  );
}

export default App;
