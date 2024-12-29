import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request, 
    { params }: { params: { id: string } }
) { 
    try { 
        const userId = parseInt(params.id, 10)
        const bookmarks = await prisma.bookmark.findMany({
            where: { 
                userId: userId, 
            },  
        });


        if (bookmarks.length === 0) {
            return NextResponse.json({ error: 'No bookmarks found for this user' }, { status: 404 });
        }

        return NextResponse.json(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmark:', error);
        return NextResponse.json({ error: 'Error fetching bookmark' }, { status: 500 });
    }
}