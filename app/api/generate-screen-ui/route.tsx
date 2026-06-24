import { db } from "@/config/db";
import { openrouter } from "@/config/openrouter";
import { ScreenConfigTable } from "@/config/schema";
import { GENERATE_SCREEN_PROMPT } from "@/data/Prompt";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
      const {projectId,screenId,screenName,purpose,screenDescription,projectvisualDecription}=await req.json();
      
      if (!projectId || !screenId) {
        return NextResponse.json(
          { error: "Missing projectId or screenId" },
          { status: 400 }
        );
      }

      const userInput=`
      screen Name is:${screenName},
      screen purpose:${purpose},
      screen Description:${screenDescription}
      `;

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
     
      const code = aiResult?.choices?.[0]?.message?.content;

      if (!code) {
        return NextResponse.json(
          { error: "No code generated from AI" },
          { status: 500 }
        );
      }

      console.log("GENERATED CODE LENGTH:", code.length);

      const updateResult = await db.update(ScreenConfigTable)
        .set({
          code: code as string
        })
        .where(and(
          eq(ScreenConfigTable.projectId, projectId as string),
          eq(ScreenConfigTable.screenId, screenId as string)
        ))
        .returning();

      console.log("UPDATE SUCCESSFUL:", updateResult.length, "records updated");

      return NextResponse.json({
        success: true,
        updated: updateResult.length > 0
      });
    }
    catch (e) {
      console.error("GENERATE SCREEN ERROR:", e);
      return NextResponse.json(
        { 
          error: "Internal Server Error",
          details: String(e)
        },
        { status: 500 }
      );
    }  
}
