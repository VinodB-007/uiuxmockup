import { screenConfig } from '@/type/types'
import { Button } from '@base-ui/react'
import { Code2Icon, Copy, Download, Ghost, GripVertical, Loader2Icon, LoaderIcon, MoreVertical, Sparkle, SparkleIcon, Trash } from 'lucide-react'
import React, { useContext, useState } from 'react'
const ButtonAny: any = Button;
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { toast } from 'sonner'
import { HtmlWrapper } from '@/data/constent'
import html2canvas from 'html2canvas'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from 'axios'
import { RefreshDataContext } from '@/context/RefreshDataContext'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from '@/components/ui/textarea'

type props={
    screen:screenConfig |undefined  ,
    theme:any,
    iframeRef:any,
    projectId:string |undefined
}

function ScreenHandler({ screen, theme,iframeRef,projectId}: props) {

const htmlCode=HtmlWrapper(theme,screen?.code as string);
const {refreshData,setRefreshData}=useContext(RefreshDataContext);
const [editInput,setEditInput]=useState<string>();
const [loading,setLoading]=useState(false);

const takeIframeScreenshot = async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        const body = doc.body;

        // wait one frame to ensure layout is stable
        await new Promise((res) => requestAnimationFrame(res));

        const canvas = await html2canvas(body, {
            backgroundColor: null,
            useCORS: true,
            scale: window.devicePixelRatio || 1,
        });

        const image = canvas.toDataURL("image/png");

        // download automatically
        const link = document.createElement("a");
        link.href = image;
        link.download = `${screen?.screenName as  string || "screen"}.png`;
        link.click();
    } catch (err) {
        console.error("Screenshot failed:", err);
    }
};

const onDeleteScreen = async () => {
    const result=await axios.delete(`/api/generate-config?projectId=${projectId}&screenId=${screen?.screenId}`);    
    toast.success("Screen deleted successfully");
    setRefreshData({method:'screenConfig',data:Date.now()});
}

const editScreen = async () => {
    setLoading(true)
      toast.info("Regenrating new screen,please wait...");
    const result=await axios.post(`/api/edit-screen`,{
        projectId:projectId,
        screenId:screen?.screenId,
        userInput:editInput,
        oldCode:screen?.code,   
    });
  toast.success("Screen Edited successfully");
    setRefreshData({method:'screenConfig',data:Date.now()});
    setLoading(false)
}

  return (
    <div className='flex justify-between items-center w-full'>
        <div>
       <GripVertical className='text-gray-500 h-4 w-4'/>
       <h2>{screen?.screenName || "Screen"}</h2>
       </div>

     <div>
        
        <Dialog>
  <DialogTrigger>
    <ButtonAny variant={'ghost'} ><Code2Icon/></ButtonAny>
  </DialogTrigger>
  <DialogContent className="max-w-5xl w-full h-[70vh] flex flex-col">
    <DialogHeader>
      <DialogTitle>HTML + Tailwind Code</DialogTitle>
      <DialogDescription>
        <div className='flex-1 overflow-auto rounded-md border bg-muted p-4'>
        {/* @ts-ignore */}
        <SyntaxHighlighter language="html"
         style={docco}
         customStyle={{
            margin:0,
            padding:0,
            whiteSpace:"pre-wrap",
            wordBreak:"break-word",
            overflowX:"hidden",
            height:"50vh"
         }}

        codeTagProps={{
            style:{
            whiteSpace:"pre-wrap",
            wordBreak:"break-word",
            }
        }}

         >
     {htmlCode}
    </SyntaxHighlighter>
    
       </div>
      <ButtonAny className='mt-3' onClick={()=>{navigator.clipboard.writeText(htmlCode as string);
        toast.success("Code copied to clipboard")
       }}><Copy/>copy</ButtonAny>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

<ButtonAny variant={'ghost'}>
  <Download/>
</ButtonAny>




<Popover>
  <PopoverTrigger >
    <ButtonAny value={'ghost'}><SparkleIcon/></ButtonAny>
  </PopoverTrigger>
  <PopoverContent>
   <div>
<Textarea placeholder="what you want to make"
onChange={(event)=>setEditInput(event.target.value)}
/>
<ButtonAny className='ml-2 h-8 px-2 text-sm'
disabled={loading}
  onClick={()=>editScreen()}
  >{loading ? <Loader2Icon className='animate-spin' /> : <Sparkle/>} Regenerate</ButtonAny> 

   </div>
  </PopoverContent>
</Popover>

<DropdownMenu>
  <DropdownMenuTrigger><ButtonAny variant={'ghost '}>
    <MoreVertical/>
</ButtonAny> </DropdownMenuTrigger>
  <DropdownMenuContent>

      <DropdownMenuItem variant='destructive' onClick={onDeleteScreen}>
        <Trash/> Delete
      </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

     </div>
    </div>
  )
}

export default ScreenHandler
