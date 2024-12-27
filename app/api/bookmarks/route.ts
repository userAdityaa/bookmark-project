import { prisma } from "@/lib/prisma";
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

export async function DELETE(request: Request) { 
    try { 

    } catch (error) { 
        return NextResponse.json({error: "Error Deleting Bookmarks"}, {status: 500})
    }
}

export async function POST(request: Request) { 
    try { 
        const {name, userId} = await request.json(); 
        if (!name || !userId) {
            return NextResponse.json({ error: "Missing required fields: name or userId" }, { status: 400 });
        }
        const value = Math.floor(Math.random() * 6) + 1;
        const assetIcon = `/user-${value}.svg`
        const bookmark = await prisma.bookmark.create({
            data: {
                name,
                icon: assetIcon,
                userId
            }
        });
        return NextResponse.json(bookmark);
    } catch (error) { 
        return NextResponse.json({error: "Error Creating Bookmarks"}, {status: 500})
    }
}
