import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthMe from '../shared/hooks/authmeHook'
import AppLoader from '../shared/ui/AppLoader'

function MainProtect() {

  const {data , isLoading} =  useAuthMe()

  if(isLoading){
    return <AppLoader label="Loading your chats…" />
  }


  // console.log(data?.data?.email) 
  if(!data?.data?.email){
    return <Navigate to="/" />
  }


  return (
    <div>
      <Outlet />
    </div>
  )
}

export default MainProtect