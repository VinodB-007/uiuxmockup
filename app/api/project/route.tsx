import { db } from "@/config/db";
import { ProjectTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
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