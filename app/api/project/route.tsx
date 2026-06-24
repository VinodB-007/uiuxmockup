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
  try {
    const projectId = req.nextUrl.searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId" },
        { status: 400 }
      );
    }

    let user;
    try {
      user = await currentUser();
    } catch (authError) {
      console.error("Clerk auth error:", authError);
      // Continue without user auth for now - just return project if it exists
    }

    // Query project data
    const projectQuery = await db.select().from(ProjectTable)
      .where(eq(ProjectTable.projectId, projectId as string));

    // Query screen configs
    const screenConfigs = await db.select().from(ScreenConfigTable)
      .where(eq(ScreenConfigTable.projectId, projectId as string));

    return NextResponse.json({
      projectDetail: projectQuery[0] || null,
      ScreenConfig: screenConfigs || []
    });

  } catch (e) {
    console.error("GET PROJECT ERROR:", e);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: String(e)
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { projectName, theme, projectId } = await req.json();
  const result = await db.update(ProjectTable).set({
    projectName:projectName,
    theme:theme,
    
  }).where(eq(ProjectTable.projectId, projectId ))  
  .returning();

  return NextResponse.json(result[0]);

}