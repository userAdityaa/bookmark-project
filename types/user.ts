import { Bookmark } from "@prisma/client"

export interface User {
    id: number
    name: string
    icon: string
    email: string
    bookmarkList: Bookmark[]
  }
  
  export interface UserCreateInput {
    name: string
    email: string
    password: string
    icon: string
  }