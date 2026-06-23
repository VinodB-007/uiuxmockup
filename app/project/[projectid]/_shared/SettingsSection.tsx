

"use client";

import { Button } from "@/components/ui/button";
import { THEME_NAME_LIST, THEMES } from "@/data/Themes";
import { projectType } from "@/type/types";
import { Camera, Share, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

type props = {
  projectDetail: projectType | undefined;
};

function SettingsSection({ projectDetail }: props) {
  const [selectedTheme, setSelectedTheme] = useState("AURORA_INK");

  // FIXED
  const [projectName, setProjectName] = useState("");

  const [userNewScreenInput, setUserNewScreenInput] = useState("");

  useEffect(() => {
    if (projectDetail?.projectName) {
      setProjectName(projectDetail.projectName);
    }
  }, [projectDetail]);

  return (
    <div className="w-[300px] h-[90vh] p-5 border-r">
      <h2 className="font-medium text-lg">Settings</h2>

      <div className="mt-4">
        <h2 className="text-sm mb-1">Project Name</h2>

        <input
          placeholder="Project Name"
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
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

      <Button size="sm" className="mt-3 w-full">
        <Sparkles className="w-4 h-4 mr-2" />
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
                onClick={() => setSelectedTheme(theme)}
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
          className="mt-3"
        >
          <Camera />
          Screenshot
        </Button>

        <Button
          size={"sm"}
          variant={"outline"}
          className="mt-3"
        >
          <Share />
          Share
        </Button>
      </div>
    </div>
  );
}

export default SettingsSection;