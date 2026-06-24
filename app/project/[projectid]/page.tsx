
"use client";

import React, { useContext, useEffect, useState } from "react";
import ProjectHeader from "./_shared/ProjectHeader";

import axios from "axios";
import { useParams } from "next/navigation";
import { projectType, screenConfig } from "@/type/types";
import { LoaderIcon } from "lucide-react";
import Canvas from "./_shared/Canvas";
import { SettingContext } from "@/context/SettingContext";
import { RefreshDataContext } from "@/context/RefreshDataContext";


function ProjectCanvasPlayground() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [isGenerating, setIsGenerating] =
  useState(false);

  const [projectDetail, setProjctDetail] = useState<projectType>();
  const [screenConfigOriginal, setScreenConfigOriginal] = useState<screenConfig[]>([]);
  const [screenConfig, setScreenConfig] = useState<screenConfig[]>([]);
const {settingDetail,setSettingDetail}=useContext(SettingContext);
  const {refreshData, setRefreshData} = useContext(RefreshDataContext);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("Loading");

  useEffect(() => {
    if (projectId) {
      GetProjectDetail();
    }
  }, [projectId]);

  useEffect(() => {
    if (refreshData?.method == "screenConfig") {
      GetProjectDetail();
    }
  }, [refreshData]);

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
    setSettingDetail(result.data.projectDetail)
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
    console.log("GENERATE CONFIG STARTED");
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


const GenerateScreenUIUX = async () => {
  try {
    setLoading(true);

    console.log(
      "TOTAL SCREENS:",
      screenConfigOriginal.length
    );

    for (
      let index = 0;
      index < screenConfigOriginal.length;
      index++
    ) {
      const screen =
        screenConfigOriginal[index];

      if (screen?.code) continue;

      setLoadingMsg(
        `Generating Screen ${index + 1}`
      );

      await axios.post(
        "/api/generate-screen-ui",
        {
          projectId,
          screenId: screen.screenId,
          screenName: screen.screenName,
          purpose: screen.purpose,
          screenDescription:
            screen.screenDescription,
        }
      );

      console.log(
        "SCREEN GENERATED:",
        screen.screenName
      );
    }

    await GetProjectDetail();
  } catch (err) {
    console.error(
      "GENERATE UI ERROR:",
      err
    );
  } finally {
    setLoading(false);
    setIsGenerating(false);
  }
};
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
    
        <SettingsSection
          projectDetail={projectDetail}
          screenDescription={screenConfig[0]?.screenDescription}
        />
       

        {/* canvas */}
      <Canvas projectDetail={projectDetail} 
      screenConfig={screenConfig}/>
      </div>
    </div>
  );
}

// Simple local SettingsSection to fix missing reference
function SettingsSection({
  projectDetail,
  screenDescription,
}: {
  projectDetail?: projectType & { name?: string };
  screenDescription?: string;
}) {
  return (
    <div className="w-80 p-4">
      <h3 className="font-semibold">Settings</h3>
      <div className="text-sm mt-2">Project: {projectDetail?.name || "-"}</div>
      <div className="text-sm mt-1">Device: {projectDetail?.device || "-"}</div>
      <div className="text-sm mt-2">Screen: {screenDescription || "-"}</div>
    </div>
  );
}
