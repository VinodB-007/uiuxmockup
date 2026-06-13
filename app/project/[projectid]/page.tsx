
"use client";

import React, { useEffect, useState } from "react";
import ProjectHeader from "./_shared/ProjectHeader";
import SettingsSection from "./_shared/SettingsSection";
import axios from "axios";
import { useParams } from "next/navigation";
import { projectType, screenConfig } from "@/type/types";
import { LoaderIcon } from "lucide-react";

function ProjectCanvasPlayground() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [projectDetail, setProjctDetail] = useState<projectType>();
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
      setLoadingMsg("Loading...");

      const result = await axios.get(
        "/api/project?projectId=" + projectId
      );

      console.log("FULL DATA:", result.data);
      console.log("PROJECT:", result.data.projectDetail);
      console.log("SCREEN CONFIG:", result.data.ScreenConfig);

      setProjctDetail(result?.data?.projectDetail);
      setScreenConfig(result?.data?.ScreenConfig || []);
    } catch (error) {
      console.error("GET PROJECT ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectDetail && screenConfig.length === 0) {
      console.log("GENERATE CONFIG CALLED");
      generateScreenConfig();
    }
  }, [projectDetail, screenConfig]);

  const generateScreenConfig = async () => {
    try {
      console.log("GENERATE CONFIG FUNCTION RUNNING");

      setLoading(true);
      setLoadingMsg("Generating Screen Config...");

      const result = await axios.post("/api/generate-config", {
        projectId,
        deviceType: projectDetail?.device,
        userInput: projectDetail?.userInput,
      });

      console.log( result.data);
      GetProjectDetail();

      // Config generate hone ke baad fresh data load karo
      await GetProjectDetail();
    } catch (error) {
      console.error("GENERATE CONFIG ERROR:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <ProjectHeader />

      <div>
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
      </div>
    </div>
  );
}

export default ProjectCanvasPlayground;