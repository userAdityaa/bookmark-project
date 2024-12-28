import { getUserIdFromToken } from "@/app/utils/getUserFromToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request) { 
    const userId = getUserIdFromToken();

    if(!userId) { 
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }
    try { 
        const user = await prisma.user.findUnique({
            where: {id: userId}
        })

        if(!user) { 
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({user})
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}