import { db } from "@/config/db";
import { openrouter } from "@/config/openrouter";
import { ScreenConfigTable } from "@/config/schema";
import { GENERATE_SCREEN_PROMPT } from "@/data/Prompt";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const {projectId,screenId,screenName,purpose,screenDescription,projectvisualDecription}=await req.json();
    const userInput=`
    screen Name is:${screenName},
    screen purpose:${purpose},
    screen Description:${screenDescription}
    `

    try{

      const aiResult = await openrouter.chat.send({
      chatRequest: {
        model: "openai/gpt-oss-120b:free",
        messages: [
          {
            role: "system",
            content: GENERATE_SCREEN_PROMPT
          },
          {
            role: "user",
            content: userInput,
          },
        ],
        stream: false,
      },
    });
     

    console.log("AI RESULT:", aiResult);
const code = aiResult?.choices[0]?.message?.content;
const updateResult=await db.update(ScreenConfigTable)
.set({
    code:code as string
}).where(and(eq(ScreenConfigTable.projectId,projectId),
eq(ScreenConfigTable?.screenId,screenId as string)))
.returning()

    return NextResponse.json(updateResult[0])
}
 catch (e) {
  console.log("GENERATE SCREEN ERROR:", e);

  return NextResponse.json(
    { msg: "Internal Server Error!!" },
    { status: 500 }
  );
}  
}