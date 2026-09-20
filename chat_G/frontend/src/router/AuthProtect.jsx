import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthMe from '../shared/hooks/authmeHook'
import AppLoader from '../shared/ui/AppLoader'

function AuthProtect() {

  const {data,isLoading} = useAuthMe()

    if(isLoading){
    return <AppLoader label="Checking your session…" />
  }


  // console.log(data?.data?.email) 
  if(data?.data?.email){
    return <Navigate to="/home" />
  }

  return (
    <div>
        <Outlet />
    </div>
  )
}

export default AuthProtect