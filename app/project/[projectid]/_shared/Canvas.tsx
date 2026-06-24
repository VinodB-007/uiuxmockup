import React, { useState } from 'react'
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import ScreenFrame from './ScreenFrame';
import { projectType, screenConfig } from '@/type/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus, RefreshCw } from 'lucide-react';
// import { Button } from '@base-ui/react';
import { Button } from "@/components/ui/button";



type props={
  projectDetail:projectType |undefined,
  screenConfig:screenConfig[],
  loading?:boolean,
}

function Canvas({projectDetail,screenConfig,loading}:props) {
  console.log("SCREEN CONFIG COUNT =", screenConfig.length);
console.log(screenConfig);
console.log("FIRST SCREEN CODE");
console.log(screenConfig?.[0]?.code);

const [PanningEnabled,setPanningEnabled]=useState(true)

const isMobile=projectDetail?.device=="mobile";

const SCREEN_WIDTH=isMobile?400:1200;
const SCREEN_HIGHT=isMobile?800:800;
const GAP=isMobile?10:20;

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools absolute p-2 px-3 bg-white shadow flex gap-3 rounded-4xl bottom-10 left-1/2 z-30 text-gray-500">
      <Button variant={'ghost'} size={'sm'} onClick={() => zoomIn()}><Plus/></Button>
      <Button  variant={'ghost'} size={'sm'} onClick={() => zoomOut()}><Minus/></Button>
      <Button  variant={'ghost'} size={'sm'} onClick={() => resetTransform()}><RefreshCw/></Button>
    </div>
  );
};



  return (
    <div className='w-full h-screen bg-gray-100'
    style={{
        backgroundImage:"radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)",
        backgroundSize:"20px 20px"
    }}
    >
     <TransformWrapper 
     initialScale={0.8}
     minScale={0.8}
     maxScale={3}
     initialPositionX={50}
     initialPositionY={50}
     limitToBounds={false}
     wheel={{step:0.8}}
     doubleClick={{disabled: false}}
     panning={{disabled:!PanningEnabled}}
     >

 {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Controls />      
      <TransformComponent 
      wrapperStyle={{width:"100%",height:"100%"}}
      >
{screenConfig?.map((screen,index)=>(
  <div>
  {screen?.code?<ScreenFrame
  x={(index % 4) * (SCREEN_WIDTH + GAP)}
    y={Math.floor(index / 4) * (SCREEN_HIGHT + 100)}
  width={SCREEN_WIDTH}
  height={SCREEN_HIGHT} 
 key={screen.screenId} setPanningEnabled={setPanningEnabled}
 htmlCode={screen?.code}
 projectDetail={projectDetail}
 screen={screen}

 />:
 <div className='bg-white rounded-2xl p-5 gap-4 flex flex-col'
 style={{
  width:SCREEN_WIDTH,
  height:SCREEN_HIGHT,
 }}
 >
  <Skeleton className='w-full rounded-lg h-10 bg-gray-200'/>
  <Skeleton className='w-[50%] rounded-lg h-20 bg-gray-200'/>
  <Skeleton className='w-[70%] rounded-lg h-30 bg-gray-200'/>
  <Skeleton className='w-[30%] rounded-lg h-10 bg-gray-200'/>
  <Skeleton className='w-full rounded-lg h-10 bg-gray-200'/>
  <Skeleton className='w-[50%] rounded-lg h-20 bg-gray-200'/>
  <Skeleton className='w-[70%] rounded-lg h-30 bg-gray-200'/>
  <Skeleton className='w-[30%] rounded-lg h-10 bg-gray-200'/>
   

 </div>}
 </div>
))}

      
      
      </TransformComponent>
      </>)}
    </TransformWrapper>
    </div>
  )
}

export default Canvas

