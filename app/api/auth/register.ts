// import { NextResponse } from 'next/server'
// import { hashPassword } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'

// export async function POST(request: Request) {
//   try {
//     const { name, email, password, icon } = await request.json()

//     console.log('Registration attempt:', { name, email, icon })

//     // Validate input
//     if (!email || !password || !name) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       )
//     }

//     // Check if user already exists
//     const existingUser = await prisma.user.findFirst({
//       where: { email }
//     })

//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'Email already registered' },
//         { status: 400 }
//       )
//     }

//     // Hash password
//     const hashedPassword = await hashPassword(password)
//     const value = Math.floor(Math.random() * 6) + 1
//     const assetIcon = `/user-${value}.svg`

//     // Create user and default bookmark in a transaction
//     const result = await prisma.$transaction(async (tx) => {
//       // First create the user
//       const newUser = await tx.user.create({
//         data: {
//           name,
//           email,
//           password: hashedPassword,
//           icon: icon || assetIcon,
//         },
//         include: {
//           bookmarks: true
//         }
//       })

//       // Then create the default bookmark
//       const defaultBookmark = await tx.bookmark.create({
//         data: {
//           name: 'Default Bookmark',
//           icon: assetIcon,
//           userId: newUser.id
//         }
//       })

//       // Fetch the complete user data with bookmarks
//       const userWithBookmarks = await tx.user.findUnique({
//         where: { id: newUser.id },
//         include: {
//           bookmarks: true
//         }
//       })

//       return userWithBookmarks
//     })

//     // Remove password from response
//     const { password: _, ...userWithoutPassword } = result || {}

//     console.log('Registration successful:', {
//       userId: userWithoutPassword.id,
//       bookmarkCount: userWithoutPassword.bookmarks?.length
//     })

//     return NextResponse.json({ 
//       user: userWithoutPassword,
//       message: 'User registered successfully'
//     })

//   } catch (error) {
//     console.error('Registration error:', error)
//     return NextResponse.json(
//       { 
//         error: 'Error creating user',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     )
//   }
// }