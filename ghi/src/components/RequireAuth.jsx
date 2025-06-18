import { useAuth } from '../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export const RequireAuth = ({ children, userType }) => {
    const { isAuthenticated, userType: currentUserType, isLoading } = useAuth()
    const location = useLocation()
    const [delayComplete, setDelayComplete] = useState(false)

    // Add a small delay to ensure auth state has time to update
    useEffect(() => {
        const timer = setTimeout(() => {
            setDelayComplete(true)
        }, 200) // 200ms delay

        return () => clearTimeout(timer)
    }, [])

    // Show loading while auth is checking or delay is active
    if (isLoading || !delayComplete) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-gray-500">Loading...</div>
        </div>
    }

    if (!isAuthenticated) {
        // Redirect to home page where users can choose their path
        return <Navigate to="/" state={{ from: location }} replace />
    }

    // If user is authenticated but wrong type, redirect to appropriate dashboard
    if (userType && currentUserType && currentUserType !== userType) {
        if (currentUserType === 'customer') {
            return <Navigate to="/customer/dashboard" replace />
        } else {
            return <Navigate to="/marketplace" replace />
        }
    }

    return children
}
