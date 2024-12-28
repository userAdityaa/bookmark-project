import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string; bookmarkName: string } }
) {
  try {
    const { userId, bookmarkName } = params;
    
    if (!userId || !bookmarkName) {
      return NextResponse.json({ error: "Missing userId or bookmarkName" }, { status: 400 });
    }

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.findFirst({
      where: {
        userId: parsedUserId,
        name: {
          equals: bookmarkName.toLowerCase(),  
          mode: 'insensitive', 
        },
      },
      include: {
        listItems: true, 
      },
    });

    if (!bookmark) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    return NextResponse.json(bookmark);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching bookmark" }, { status: 500 });
  }
}
