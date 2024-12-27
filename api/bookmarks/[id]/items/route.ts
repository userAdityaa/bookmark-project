import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const { name, icon, link } = await request.json()
      const listItem = await prisma.listItem.create({
        data: {
          name,
          icon,
          link,
          bookmarkId: parseInt(params.id)
        }
      })
      return NextResponse.json(listItem)
    } catch (error) {
      return NextResponse.json({ error: 'Error creating list item' }, { status: 500 })
    }
  }