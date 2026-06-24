import { db } from "@/config/db";
import { openrouter } from "@/config/openrouter";
import { ScreenConfigTable } from "@/config/schema";
import { GENERATE_SCREEN_PROMPT } from "@/data/Prompt";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   try {
      const {
         projectId,
         screenId,
         screenName,
         purpose,
         screenDescription,
         projectvisualDecription,
      } = await req.json();

      if (!projectId || !screenId) {
         return NextResponse.json(
            { error: "Missing projectId or screenId" },
            { status: 400 }
         );
      }

      const userInput = purpose || screenDescription || "";
      
      const USER_INPUT = `
        make changes as per user input in the code, keeping design and style same, do not change it. just make the requested changes :${userInput}`
     
      

      const aiResult = await openrouter.chat.send({
         chatRequest: {
            model: "openai/gpt-oss-120b:free",
            messages: [
               {
                  role: "user",
                  content: USER_INPUT,
               },
            ],
            stream: false,
         },
      });
      const code = aiResult?.choices?.[0]?.message?.content;
      const updateResult = await db.update(ScreenConfigTable)
         .set({
            code: code as string,
         })
         .where(and(
            eq(ScreenConfigTable.projectId, projectId ),
            eq(ScreenConfigTable.screenId, screenId as string)
         ));

      return NextResponse.json({
         success: true,
         result: aiResult,
      });
   } catch (e) {
      return NextResponse.json(
         {
            error: "Internal Server Error",
            details: String(e),
         },
         { status: 500 }
      );
   }
}