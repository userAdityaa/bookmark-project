import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() { 
    try { 
        const bookmarks = await prisma.bookmark.findMany({
            include: {
                listItems: true,
            }
        })
        return NextResponse.json(bookmarks)
    } catch (error) { 
        return NextResponse.json({error: 'Error Fetching Bookmarks'}, {status: 500})
    }
}

export async function POST(request: Request) { 
    try { 
        const {name, icon} = await request.json(); 
        const bookmark = await prisma.bookmark.create({
            data: {
                name, 
                icon
            }
        })
        return NextResponse.json(bookmark)
    } catch (error) { 
        return NextResponse.json({error: "Error Creating Bookmarks"}, {status: 500})
    }
}
