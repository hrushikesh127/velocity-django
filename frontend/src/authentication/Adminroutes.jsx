import React, { use } from 'react'
import { getuser } from '../App'
import { Navigate, Outlet } from 'react-router-dom';
import Adminnavbar from '../admin/adminnavbar';

function Adminroutes() {
    const user = getuser();
  return user?.isadmin ?(<> <Adminnavbar/> <Outlet/></>) : <Navigate to='/'/>
}

export default Adminroutes;
