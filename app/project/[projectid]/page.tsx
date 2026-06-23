
"use client";

import React, { useEffect, useState } from "react";
import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import axios from "axios";
import { useParams } from "next/navigation";
import { projectType, screenConfig } from "@/type/types";
import { LoaderIcon } from "lucide-react";
import Canvas from "./_shared/Canvas";

function ProjectCanvasPlayground() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [projectDetail, setProjctDetail] = useState<projectType>();
  const [screenConfigOriginal, setScreenConfigOriginal] = useState<screenConfig[]>([]);
  const [screenConfig, setScreenConfig] = useState<screenConfig[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("Loading");

  useEffect(() => {
    if (projectId) {
      GetProjectDetail();
    }
  }, [projectId]);

const GetProjectDetail = async () => {
  try {
    setLoading(true);
    setLoadingMsg("Loading Project...");

    const result = await axios.get(
      "/api/project?projectId=" + projectId
    );

    console.log(
      "PROJECT RESPONSE:",
      result.data
    );

    setProjctDetail(result.data.projectDetail);

    setScreenConfigOriginal(
      result.data.ScreenConfig || []
    );

    setScreenConfig(
      result.data.ScreenConfig || []
    );
  } catch (error) {
    console.error(
      "GET PROJECT ERROR:",
      error
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!projectDetail) return;

  if (screenConfigOriginal.length === 0) {
    generateScreenConfig();
  } else {
    setScreenConfig(screenConfigOriginal);

    const pendingScreens =
      screenConfigOriginal.filter(
        (screen) => !screen.code
      );

    if (pendingScreens.length > 0) {
      GenerateScreenUIUX();
    }
  }
}, [projectDetail, screenConfigOriginal]);
// useEffect(() => {
//   console.log("USE EFFECT RUN");
//   console.log("projectDetail =", projectDetail);
//   console.log(
//     "screenConfigOriginal =",
//     screenConfigOriginal.length
//   );

//   console.log(
//     screenConfigOriginal.map((item) => ({
//       name: item.screenName,
//       hasCode: !!item.code,
//     }))
//   );

//   if (!projectDetail) return;

//   if (screenConfigOriginal.length === 0) {
//     generateScreenConfig();
//   } else {
//     const pendingScreens =
//       screenConfigOriginal.filter(
//         (screen) => !screen.code
//       );

//     console.log(
//       "Pending Screens:",
//       pendingScreens.length
//     );

//     if (pendingScreens.length > 0) {
//       GenerateScreenUIUX();
//     }
//   }
// }, [projectDetail, screenConfigOriginal]);

const generateScreenConfig = async () => {
  try {
    setLoading(true);
    setLoadingMsg("Generating Screen Config...");

    const result = await axios.post(
      "/api/generate-config",
      {
        projectId,
        deviceType: projectDetail?.device,
        userInput: projectDetail?.userInput,
      }
    );

    console.log(
      "CONFIG GENERATED:",
      result.data
    );

    await GetProjectDetail();
  } catch (error) {
    console.error(
      "GENERATE CONFIG ERROR:",
      error
    );
  } finally {
    await GetProjectDetail();
    setLoading(false);
  }
};

const GenerateScreenUIUX=async()=>{
  setLoading(true);
  
  for (let index=0;index<screenConfig?.length;index++)
  {
    const screen=screenConfig[index];
    if (screen?.code) continue;
    setLoadingMsg(`Generating Screen ${index + 1}`);

    const result =await axios.post('/api/generate-screen-ui',{
      projectId,
      screenId:screen?.screenId,
      screenName:screen?.screenName,
      purpose:screen?.purpose,
      screenDescription:screen?.screenDescription
    })
    console.log(result.data)

  }


  setLoading(false)
}
  return (
    <div>
      <ProjectHeader />

      <div className="flex ">
        {loading && (
          <div className="p-3 absolute bg-blue-300/20 border-blue-400 border rounded-xl left-1/2 top-20">
            <h2 className="flex gap-2 items-center">
              <LoaderIcon className="animate-spin" />
              {loadingMsg}
            </h2>
          </div>
        )}
         {/* settings */}
        <SettingsSection projectDetail={projectDetail}/>

        {/* canvas */}
      <Canvas projectDetail={projectDetail} 
      screenConfig={screenConfig}/>
      </div>
    </div>
  );
}

export default ProjectCanvasPlayground;
