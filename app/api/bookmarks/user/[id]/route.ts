import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request, 
    { params }: { params: { id: string } }
) { 
    try { 
        console.log(params);
        const userId = params.id
        if (!userId) { 
            return NextResponse.json({error: "Missing user id "}, {status: 400})
        }

        const parsedUserId = parseInt(userId, 10)
        if(isNaN(parsedUserId)) { 
            return NextResponse.json({error: "Invalid userId format"}, {status: 400})
        }

        const firstBookmark = await prisma.bookmark.findFirst({
            where: {userId: parsedUserId}, 
            orderBy: {createdAt: "asc"}
        })

        if(!firstBookmark) { 
            return NextResponse.json({error: "No bookmarks found for the user" }, { status: 404 });
        }

        return NextResponse.json(firstBookmark);
    } catch (error) {
        console.error("Error fetching initial bookmark:", error);
        return NextResponse.json({ error: "Error fetching initial bookmark" }, { status: 500 });
      }
}