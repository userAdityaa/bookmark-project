// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { name, email, password, icon } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)
     const value = Math.floor(Math.random() * 6) + 1;
    const assetIcon = `/user-${value}.svg`;
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        icon,
      },
      select: {
        id: true,
        name: true,
        email: true,
        icon: true,
      }
    })

   

    const bookmark = await prisma.bookmark.create({
      data: {
        name: 'Bookmark',
        icon: assetIcon,
        userId: user.id, 
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        // You can store the bookmark ID or any related information in the user object
        bookmarkList: {
          connect: {
            id: bookmark.id,  // Associating the user with the bookmark
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        icon: true,
        bookmarkList: true,  // Make sure to include the updated bookmark list
      }
    });
    
    return NextResponse.json({ user: updatedUser, bookmark });
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    )
  }
}