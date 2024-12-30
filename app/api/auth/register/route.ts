import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { name, email, password, icon } = await request.json()
    console.log(name, email, icon)

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma?.user.findFirst({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const value = Math.floor(Math.random() * 6) + 1;
    const assetIcon = `/user-${value}.svg`

    const result = await prisma?.$transaction(async (tx) => {
      const user = await tx.user.create({
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

      await tx.bookmark.create({
        data: {
          name: 'Bookmarks',
          icon: assetIcon,
          userId: user.id,
        }
      })

      return user
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    )
  }
}