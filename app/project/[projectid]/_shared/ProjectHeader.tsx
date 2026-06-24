
import { Button } from '@/components/ui/button'
import { SettingContext } from '@/context/SettingContext'
import axios from 'axios'
import { set } from 'date-fns'
import { Loader2, Save } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { toast } from 'sonner'

function ProjectHeader() {
    const {settingDetail,setSettingDetail}=useContext(SettingContext)
    const [loading,setLoading]=useState(false);
    const OnSave =async ()=>{
      try{
      setLoading(true);

      const result=await axios.put(`/api/project/`,{
        theme:settingDetail?.theme,
        projectId:settingDetail?.projectId,
        projectName:settingDetail?.projectName,
      })
      setLoading(false);
      toast.success("Settings saved successfully!");
    } catch (e) {
      setLoading(false);
      toast.error("Internal Server Error");
    }}
  return (
    <div className='flex items-center justify-between p-3 shadow'>
      <div className="flex gap-2 items-center">
              <Image
                src="/logo.png"
                alt="logo"
                width={40}
                height={40}
              />
              <h2 className="text-xl font-semibold">
              <span className="text-primary">UIUX </span>  MOCK
              </h2>
            </div>
            <Button onClick={OnSave} disabled={loading}> {loading?<Loader2 className='animate-spin'/>:<Save/>}save</Button>
    </div>
  )
}

export default ProjectHeader
