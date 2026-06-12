import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const users = await db
      .select()
      .from(usersTable)
      .where(
        eq(
          usersTable.email,
          user.primaryEmailAddress?.emailAddress || ""
        )
      );

    if (users.length === 0) {
      const result = await db
        .insert(usersTable)
        .values({
          name: user.fullName ?? "User",
          email: user.primaryEmailAddress?.emailAddress || "",
          age: 0,
        })
        .returning();

      return NextResponse.json(result[0]);
    }

    return NextResponse.json(users[0]??{});

  } catch (error) {
    console.error("USER API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// import { db } from "@/config/db";
// import { usersTable } from "@/config/schema";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { eq } from "drizzle-orm";
// import { sql } from "drizzle-orm";

// export async function POST() {
//   try {
//     const user = await currentUser();

//     console.log("USER:", user?.primaryEmailAddress?.emailAddress);

//     // const users = await db
//     //   .select()
//     //   .from(usersTable)
//     //   .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress!));
//     const users = await db.execute(
//   sql`SELECT * FROM users`
// );

// console.log(users);

//     return NextResponse.json(users);
//   } catch (error) {
//     console.error("FULL ERROR =>", error);
//     return NextResponse.json(
//       { error: String(error) },
//       { status: 500 }
//     );
//   }
// }