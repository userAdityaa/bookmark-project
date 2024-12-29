import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function DELETE(request: Request, 
    { params }: {params: {id: string}}
) {
    try {
        const bookmarkId = params.id

        if (!bookmarkId) {
            return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
        }

        const id = parseInt(bookmarkId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const deletedBookmark = await prisma.bookmark.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Bookmark deleted successfully", bookmark: deletedBookmark });
    } catch (error) {
        console.error("Error deleting bookmark:", error);
        return NextResponse.json({ error: "Error deleting bookmark" }, { status: 500 });
    }
}

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

export async function POST ( req: Request, 
    {params}: {params: {id: string}}
) { 
    const {bookmarkName} = await req.json();
    const userId = parseInt(params.id)

    if(!bookmarkName || !userId) { 
        return NextResponse.json({error: "Bookmark name or user Id not found"}, { status: 400 })
    }
    try { 
        const existingBookmark = await prisma.bookmark.findFirst({
            where: {
                name: bookmarkName, 
                userId: userId
            }
        });

        if(existingBookmark) { 
            return NextResponse.json(
                { error: "A bookmark with this name already exists" },
                { status: 409 }
            );
        }

        const value = Math.floor(Math.random() * 6) + 1;
        const assetIcon = `/user-${value}.svg`

        const newBookmark = await prisma.bookmark.create({
            data: {
                name: bookmarkName, 
                icon: assetIcon,
                userId: userId
            }
        });

        return NextResponse.json(newBookmark, { status: 200 });
    } catch (error) { 
        return NextResponse.json({error: "Error Creating Bookmark"}, {status: 500})
    }
}