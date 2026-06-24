

"use client";

import { Button } from "@/components/ui/button";
import { RefreshDataContext } from "@/context/RefreshDataContext";
import { SettingContext } from "@/context/SettingContext";
import { THEME_NAME_LIST, THEMES } from "@/data/Themes";
import { projectType } from "@/type/types";
import axios from "axios";
import { Camera, Loader2Icon, LoaderIcon, Share, Sparkles } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

type props = {
  projectDetail: projectType | undefined;
  screenDescription: string | undefined;
  takeScreenShot:any,
};

function SettingsSection({ projectDetail,screenDescription ,takeScreenShot}: props) {
  const [selectedTheme, setSelectedTheme] = useState("AURORA_INK");

  // FIXED
  const [projectName, setProjectName] = useState("");

  const [userNewScreenInput, setUserNewScreenInput] = useState("");
  const {settingDetail,setSettingDetail}=useContext(SettingContext)
  const [loading,setLoading]=useState(false)
  const [loadingMsg,setLoadingMsg]=useState("Loading");
  const {refreshData, setRefreshData} = useContext(RefreshDataContext);
  

useEffect(() => {
  projectDetail && setProjectName(projectDetail.projectName??"");
  projectDetail && setSelectedTheme(projectDetail.theme as string);
}, [projectDetail]);

const  onThemeSelect=(theme:string)=>{
  setSelectedTheme(theme);
  setSettingDetail((prev:any)=>({
    ...prev,
    theme:theme
  }))
}

const GenerateNewScreen=async()=>{
  try{
    setLoading(true);

    const resut=await axios.post("/api/generate-config",{
      projectId:projectDetail?.projectId,
      projectName:projectDetail?.projectName,
      deviceType:projectDetail?.device,
      theme:projectDetail?.theme,
      oldScreenDescription:screenDescription,
    });

    console.log(resut.data);
    setRefreshData({
      method:"screenConfig",
      data:Date.now()
    });
    setLoading(false);
  }
  catch(e){
    setLoading(false);
  }
};

  return (
    <div className="w-[300px] h-[90vh] p-5 border-r">
      <h2 className="font-medium text-lg">Settings</h2>
{loading && (
          <div className="p-3 absolute bg-blue-300/20 border-blue-400 border rounded-xl left-1/2 top-20">
            <h2 className="flex gap-2 items-center">
              <LoaderIcon className="animate-spin" />
              {loadingMsg}
            </h2>
          </div>
        )}
      <div className="mt-4">
        <h2 className="text-sm mb-1">Project Name</h2>

        <input
          placeholder="Project Name"
          value={projectName}
          onChange={(event) => {setProjectName(event.target.value)
            setSettingDetail((prev:any)=>({
    ...prev,
    projectName:projectName
  }))
          }}
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm mb-1">Generate New Screen</h2>

        <textarea
          placeholder="Enter Prompt to generate screen using AI"
          className="w-full border rounded-md p-2 text-sm min-h-[90px]"
          value={userNewScreenInput}
          onChange={(event) =>
            setUserNewScreenInput(event.target.value)
          }
        />
      </div>

      <Button
        size="sm"
        disabled={loading}
        className="mt-3 w-full"
        onClick={GenerateNewScreen}
      >
        {loading ? <Loader2Icon className="animate-spin" /> : <Sparkles />}
        Generate With AI
      </Button>

      <div className="mt-5">
        <h2 className="text-sm mb-1">Themes</h2>

        <div className="h-[200px] overflow-auto">
          <div>
            {THEME_NAME_LIST.map((theme) => (
              <div
                key={theme}
                className={`p-3 border rounded-2xl mb-2 ${
                  theme === selectedTheme
                    ? "border-primary bg-primary/20"
                    : ""
                }`}
                onClick={() => onThemeSelect(theme)}
              >
                <h2>{theme}</h2>

                <div className="flex gap-2">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{
                      background: THEMES[theme]?.primary,
                    }}
                  />

                  <div
                    className="h-4 w-4 rounded-full"
                    style={{
                      background: THEMES[theme]?.secondary,
                    }}
                  />

                  <div
                    className="h-4 w-4 rounded-full"
                    style={{
                      background: THEMES[theme]?.accent,
                    }}
                  />

                  <div
                    className="h-4 w-4 rounded-full"
                    style={{
                      background: THEMES[theme]?.background,
                    }}
                  />

                  <div
                    className="h-4 w-4 rounded-full"
                    style={{
                      background: `linear-gradient(
                        135deg,
                        ${THEMES[theme].background},
                        ${THEMES[theme].primary},
                        ${THEMES[theme].accent}
                      )`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-sm mb-1">Extras</h2>
      </div>

      <div className="flex gap-3">
        <Button
          size={"sm"}
          variant={"outline"}
          className="mt-2"
          onClick={()=>takeScreenShot()}
        >
          <Camera />
          Screenshot
        </Button>

        <Button
          size={"sm"}
          variant={"outline"}
          className="mt-2"
        >
          <Share />
          Share
        </Button>
      </div>
    </div>
  );
}

export default SettingsSection;