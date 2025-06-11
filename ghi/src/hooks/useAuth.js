import { useMemo } from 'react'
import jwt_decode from 'jwt-decode'

export function useAuth() {
    const token = localStorage.getItem('token')

    const user = useMemo(() => {
        if (!token) return null
        try {
            const decoded = jwt_decode(token)
            return decoded.user
        } catch (e) {
            console.error('Invalid token:', e)
            return null
        }
    }, [token])

    return {
        token,
        user,
        isAuthenticated: !!user,
    }
}
