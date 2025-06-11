import { useMemo } from 'react'
import { jwtDecode } from 'jwt-decode'

export function useAuth() {
    const token = localStorage.getItem('token')

    const user = useMemo(() => {
        if (!token) return null
        try {
            const decoded = jwtDecode(token)
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
