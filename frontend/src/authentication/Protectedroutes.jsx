import React from 'react'
import { getuser } from '../App'
import { Navigate, Outlet } from 'react-router-dom'

function Protectedroutes() {
  return getuser() ? <Outlet/> :<Navigate to='/login' replace/>
}

export default Protectedroutes
