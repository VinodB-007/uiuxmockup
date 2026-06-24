import { SettingContext } from '@/context/SettingContext';
import { THEMES, themeToCssVars } from '@/data/Themes';
import { projectType, screenConfig } from '@/type/types';
import { GripVertical } from 'lucide-react'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {Rnd, } from "react-rnd"
import ScreenHandler from './ScreenHandler';
import { HtmlWrapper } from '@/data/constent';
type props={
    x:number,
    y:number,
    setPanningEnabled:(enabled:boolean)=>void,
    width:number,
    height:number,
    htmlCode:string|undefined,
    projectDetail:projectType |undefined,
    screen:screenConfig |undefined  ,
}
function ScreenFrame({x,y,setPanningEnabled,width,height,htmlCode,projectDetail,screen}:props) {

      const {settingDetail,setSettingDetail}=useContext(SettingContext)
 

const themeKey = (settingDetail?.theme ??
  projectDetail?.theme ??
  "light") as keyof typeof THEMES;

const theme = THEMES[themeKey];
const iframeRef= useRef<HTMLIFrameElement|null>(null);

const [size,setSize]=useState({width,height});

const resizingLockRef = useRef(false);
const lastThemeRef = useRef<string|undefined>(undefined);

 
const html=HtmlWrapper(theme,htmlCode as string);

useEffect(()=>{
  setSize({width,height});

},[height,width]) 



const measureIframeHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        const headerH = 40; // drag bar height
        const htmlEl = doc.documentElement;
        const body = doc.body;

        // ✅ choose the largest plausible height
        const contentH = Math.max(
            htmlEl?.scrollHeight ?? 0,
            body?.scrollHeight ?? 0,
            htmlEl?.offsetHeight ?? 0,
            body?.offsetHeight ?? 0
        );

        // optional min/max clamps
        const next = Math.min(Math.max(contentH + headerH, 160), 2000);

        setSize((s) => (Math.abs(s.height - next) > 2 ? { ...s, height: next } : s));
    } catch {
        // if sandbox/origin blocks access, we can't measure
    }
}, []);

useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
        measureIframeHeight();

        // ✅ observe DOM changes inside iframe
        const doc = iframe.contentDocument;
        if (!doc) return;

        const observer = new MutationObserver(() => measureIframeHeight());
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
        });

        // ✅ re-check a few times for fonts/images/tailwind async layout
        const t1 = window.setTimeout(measureIframeHeight, 50);
        const t2 = window.setTimeout(measureIframeHeight, 200);
        const t3 = window.setTimeout(measureIframeHeight, 600);

        return () => {
            observer.disconnect();
            window.clearTimeout(t1);
            window.clearTimeout(t2);
            window.clearTimeout(t3);
        };
    };

    iframe.addEventListener("load", onLoad);
    window.addEventListener("resize", measureIframeHeight);

    return () => {
        iframe.removeEventListener("load", onLoad);
        window.removeEventListener("resize", measureIframeHeight);
    };
}, [measureIframeHeight, htmlCode]);
 
 
    return (
   <Rnd
   default={{
    x,
    y,
    width:width,
    height:height
   }}
   size={size}
   dragHandleClassName='drag-handle'
   enableResizing={{
    bottomLeft:true,
    bottomRight:true,
   }}
   onDragStart={()=> setPanningEnabled(false)}
   onDragStop={()=>setPanningEnabled(true)}
   onResizeStart={()=>setPanningEnabled(false)}
   onResizeStop={(_,__,ref,___,position)=>{setPanningEnabled(true);
   setSize({
    width:ref.offsetWidth,
    height:ref.offsetHeight,
   })
   }}
   >
    <div className='drag-handle flex gap-2 items-center cursor-move bg-white rounded-lg p-4 '>
       
        <ScreenHandler screen={screen} theme={theme} iframeRef={iframeRef} 
        projectId={projectDetail?.projectId}
        />
    </div>
   <iframe
   ref={iframeRef}
   className='w-full h-[calc(100%-40px)] bg-white rounded-2xl mt-5'
 sandbox="allow-same-origin allow-scripts"
   srcDoc={html}
   />
   </Rnd>
  )
}

export default ScreenFrame
