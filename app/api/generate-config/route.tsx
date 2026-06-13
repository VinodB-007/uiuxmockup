import { db } from "@/config/db";
import { openrouter } from "@/config/openrouter";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/Prompt";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userInput, deviceType, projectId } = await req.json();

  const aiResult = await openrouter.chat.send({
  chatRequest: {
    model: "openai/gpt-oss-120b:free",
    messages: [
      {
        role: "system",
        content: APP_LAYOUT_CONFIG_PROMPT.replace(
          "{deviceType}",
          deviceType
        ),
      },
      {
        role: "user",
        content: userInput,
      },
    ],
    stream: false,
  },
});
  
   const JSONAiResult=JSON.parse(aiResult?.choices[0]?.message?.content as string)



   if (JSONAiResult)
   {
   
// Update project Table with Projeect Name 
await db.update(ProjectTable).set({
    projctVisualDecription:JSONAiResult?.projectVisualDescription,
    projectName:JSONAiResult?.projectName,
    theme:JSONAiResult?.theme,
    // @ts-ignore
}).where(eq(ProjectTable.projectId,projectId as string))


// insert screen config
   JSONAiResult.screens?.forEach(async(screen:any)=>{
    const result=await db.insert(ScreenConfigTable).values({
        projectId:projectId,
        purpose:screen?.purpose,
        screenDescription:screen?.layoutDescription,
        screenId:screen?.id,
        screenName:screen?.name
    })
   })
     return NextResponse.json(JSONAiResult);
}
else{
    NextResponse.json({msg:"Internal Server Error"})
}



}
