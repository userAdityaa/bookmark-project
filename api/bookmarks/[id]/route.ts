import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request, 
    { params }: { params : {id: string} }
) { 
    try { 
        const bookmark = prisma.bookmark.findUnique ({
            where: { 
                id: parseInt(params.id)
            }, 
            include: {
                listItems: true,
            }
        })
        if (!bookmark) {
            return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 })
          }
          return NextResponse.json(bookmark)
        } catch (error) {
          return NextResponse.json({ error: 'Error fetching bookmark' }, { status: 500 })
    }
}

