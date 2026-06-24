  // import { db } from "@/config/db";
  // import { openrouter } from "@/config/openrouter";
  // import { ProjectTable, ScreenConfigTable } from "@/config/schema";
  // import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/Prompt";
  // import { eq } from "drizzle-orm";
  // import { NextRequest, NextResponse } from "next/server";

  // export async function POST(req: NextRequest) {
  //   try {
  //     const { userInput, deviceType, projectId } =
  //       await req.json();

  //     const aiResult = await openrouter.chat.send({
  //       chatRequest: {
  //         model: "openai/gpt-oss-120b:free",
  //         messages: [
  //           {
  //             role: "system",
  //             content:
  //               APP_LAYOUT_CONFIG_PROMPT.replace(
  //                 "{deviceType}",
  //                 deviceType
  //               ),
  //           },
  //           {
  //             role: "user",
  //             content: userInput,
  //           },
  //         ],
  //         stream: false,
  //       },
  //     });

  //     const rawContent =
  //       aiResult?.choices?.[0]?.message?.content || "";

  //     console.log("RAW AI RESPONSE:", rawContent);

  //     const cleanContent = rawContent
  //       .replace(/```json/g, "")
  //       .replace(/```/g, "")
  //       .trim();

  //     const JSONAiResult = JSON.parse(cleanContent);

  //     console.log("PARSED JSON:", JSONAiResult);

  //     if (!JSONAiResult) {
  //       return NextResponse.json(
  //         { msg: "Invalid AI Response" },
  //         { status: 500 }
  //       );
  //     }

  //     await db
  //       .update(ProjectTable)
  //       .set({
  //         projctVisualDecription:
  //           JSONAiResult?.projectVisualDescription,
  //         projectName: JSONAiResult?.projectName,
  //         theme: JSONAiResult?.theme,
  //       })
  //       .where(
  //         eq(
  //           ProjectTable.projectId,
  //           projectId as string
  //         )
  //       );

  //     // delete old screens
  //     await db
  //       .delete(ScreenConfigTable)
  //       .where(
  //         eq(
  //           ScreenConfigTable.projectId,
  //           projectId as string
  //         )
  //       );

  //   // insert screens properly
  // for (const screen of JSONAiResult.screens || []) {
  //   console.log("INSERTING SCREEN:", screen.name);

  //   await db.insert(ScreenConfigTable).values({
  //     projectId,
  //     purpose: screen?.purpose,
  //     screenDescription: screen?.layoutDescription,
  //     screenId: screen?.id,
  //     screenName: screen?.name,
  //   });
  // }

  // // CHECK DB
  // const insertedScreens = await db
  //   .select()
  //   .from(ScreenConfigTable)
  //   .where(
  //     eq(
  //       ScreenConfigTable.projectId,
  //       projectId as string
  //     )
  //   );

  // console.log(
  //   "TOTAL SCREENS IN DB =",
  //   insertedScreens.length
  // );

  // console.log(
  //   "SCREENS DATA =",
  //   insertedScreens
  // );

  //     return NextResponse.json(
  //       { msg: "Internal Server Error" },
  //       { status: 500 }
  //     );
  //   }
  // }


  import { db } from "@/config/db";
  import { openrouter } from "@/config/openrouter";
  import { ProjectTable, ScreenConfigTable } from "@/config/schema";
  import { APP_LAYOUT_CONFIG_PROMPT } from "@/data/Prompt";
import { currentUser } from "@clerk/nextjs/server";
  import { and, eq } from "drizzle-orm";
  import { NextRequest, NextResponse } from "next/server";

  export async function POST(req: NextRequest) {
    try {
      const { userInput, deviceType, projectId } =
        await req.json();

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

      const rawContent =
        aiResult?.choices?.[0]?.message?.content || "";

      console.log("RAW AI RESPONSE:", rawContent);

      const cleanContent = rawContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const JSONAiResult = JSON.parse(cleanContent);

      console.log("PARSED JSON:", JSONAiResult);

      if (!JSONAiResult) {
        return NextResponse.json(
          { msg: "Invalid AI Response" },
          { status: 500 }
        );
      }

      // Update Project
      await db
        .update(ProjectTable)
        .set({
          projctVisualDecription:
            JSONAiResult?.projectVisualDescription,
          projectName: JSONAiResult?.projectName,
          theme: JSONAiResult?.theme,
        })
        .where(
          eq(
            ProjectTable.projectId,
            projectId as string
          )
        );

      // Delete old screens
      await db
        .delete(ScreenConfigTable)
        .where(
          eq(
            ScreenConfigTable.projectId,
            projectId as string
          )
        );

      // Insert screens
      for (const screen of JSONAiResult.screens || []) {
        console.log(
          "INSERTING SCREEN:",
          screen.name
        );

        await db.insert(ScreenConfigTable).values({
          projectId,
          screenId: screen.id,
          screenName: screen.name,
          purpose: screen.purpose,
          screenDescription:
            screen.layoutDescription,
        });
      }

      // Verify insert
      const insertedScreens = await db
        .select()
        .from(ScreenConfigTable)
        .where(
          eq(
            ScreenConfigTable.projectId,
            projectId as string
          )
        );

      console.log(
        "TOTAL SCREENS IN DB =",
        insertedScreens.length
      );

      return NextResponse.json({
        success: true,
        screens: insertedScreens,
      });
    } catch (error) {
      console.error(
        "GENERATE CONFIG ERROR:",
        error
      );

      return NextResponse.json(
        {
          msg: "Internal Server Error",
          error: String(error),
        },
        { status: 500 }
      );
    }
  }



  export async function GET(req: NextRequest) {
      const projectId = req.nextUrl.searchParams.get( "projectId");
      const screenId = req.nextUrl.searchParams.get( "screenId");


      const user = await currentUser();

      if (!user) {
        return NextResponse.json(  { msg: "Unauthorized" },{ status: 400 });
      }

      const result = await db.select().from(ScreenConfigTable)
        .where( and(eq(ScreenConfigTable.screenId, screenId as string), eq(ScreenConfigTable.projectId, projectId as string)) );
  
        return NextResponse.json({msg:'Deleted' });
      }