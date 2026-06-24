"use client"
import React, { useEffect, useState} from 'react'
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailContext'
import { SettingContext } from '@/context/SettingContext'
import { RefreshDataContext } from '@/context/RefreshDataContext'

function Provider({children}:any) {

  const [UserDetail,setUserDetail]=useState()
  const [settingDetail,setSettingDetail]=useState();
  const [refreshData,setRefreshData]=useState();
    useEffect(()=>{
      CreateNewUser();
    },[])

const CreateNewUser=async()=>{
    const result=await axios.post('/api/user', {})

    console.log( result.data)
    setUserDetail(result?.data);
};

  return (
    <UserDetailContext.Provider value={{UserDetail,setUserDetail}}>
      <SettingContext.Provider value={{settingDetail,setSettingDetail}}>
        <RefreshDataContext.Provider value={{refreshData,setRefreshData}}>
    <div>{children}</div>
    </RefreshDataContext.Provider>
    </SettingContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default Provider