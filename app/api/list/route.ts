import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { name, icon, link, bookmarkId } = await request.json();

        if (!name || !icon || !link || !bookmarkId) {
            return NextResponse.json(
                { error: "Missing required fields: name, icon, link, or bookmarkId" },
                { status: 400 }
            );
        }

        const listItem = await prisma.listItem.create({
            data: {
                name,
                icon,
                link,
                bookmarkId,
            },
        });

        return NextResponse.json(listItem);
    } catch (error) {
        console.error("Error creating list item:", error);
        return NextResponse.json({ error: "Error creating list item" }, { status: 500 });
    }
}
