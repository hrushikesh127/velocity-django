import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Register from './authentication/Register'
import { settoken } from './utils/apiclient'
import Login from './authentication/login'
import { jwtDecode } from 'jwt-decode'
import Protectedroutes from './authentication/Protectedroutes'
import Adminroutes from './authentication/Adminroutes'
import Admincreatecar from './admin/admincreatecar'
import Admincarlist from './admin/admincarlist'
import Admincarupdate from './admin/admincarupdate'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './pages/home'
import Navbar from './pages/Navbar'
import Cardetailspage from './pages/cardetailspage'
import Adminrequests from './admin/adminrequests'
import Adminnavbar from './admin/adminnavbar'
import Comparecars from './pages/comparecars'
const token = localStorage.getItem('velocitytoken')
settoken(token);

export function getuser() {
  const token = localStorage.getItem('velocitytoken');
  if(token){
    const decodeduser = jwtDecode(token);
    return decodeduser;

  }else{
    return null;
  }

  
}

function App() {
  

  return (
    <>
    <BrowserRouter>
    <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
    <Navbar/>
    
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route element={<Protectedroutes/>}>
      <Route path='/' element={<Home/>}/>
      <Route path='/:id' element={<Cardetailspage/>}/>
      <Route path='/compare' element={<Comparecars/>}/>
      <Route element={<Adminroutes/>}>
      
      <Route path='/createcar' element={<Admincreatecar/>} />
      <Route path='/viewcars' element={<Admincarlist/>} />
      <Route path='/viewcars/:id' element={<Admincarupdate/>} />
      <Route path='/requests' element={<Adminrequests/>} />

      </Route>

      </Route>
      
    </Routes>
    </BrowserRouter>
    
     
    </>
  )
}

export default App
