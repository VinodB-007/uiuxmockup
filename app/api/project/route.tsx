import { db } from "@/config/db";
import { ProjectTable, ScreenConfigTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { error } from "console";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userInput, device, projectId } = await req.json();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await db
      .insert(ProjectTable)
      .values({
        projectId,
        userId: user.primaryEmailAddress?.emailAddress as string,
        device,
        userInput,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("PROJECT API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req:NextRequest) {
  const projectId= await req.nextUrl.searchParams.get('projectId');
  const user =await currentUser()
  try{
    const result =await db.select().from(ProjectTable)
    .where(and(eq(ProjectTable.projectId,projectId as string),eq(ProjectTable.userId,user?.primaryEmailAddress?.emailAddress as string)))
     
    const ScreenConfig=await db.select().from(ScreenConfigTable)
    .where(eq(ScreenConfigTable.projectId,projectId as string))

    return NextResponse.json({
      projectDetail:result[0],
      ScreenConfig:ScreenConfig
    });

  }
  catch (e){
    return NextResponse.json({msg:'Error'})
  }
}

