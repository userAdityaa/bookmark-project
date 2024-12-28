import {verify} from 'jsonwebtoken'
import {cookies} from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const getUserIdFromToken = (): number | null => { 
    const token = cookies().get('auth-token')?.value
    
    if(!token) { 
        return null
    }

    try { 
        const decode: any = verify(token, JWT_SECRET)
        return decode.userId
    } catch(error) { 
        console.error("Error Verify User", error)
        return null
    }
}