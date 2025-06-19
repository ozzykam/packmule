import { useGetUserQuery } from '../app/apiSlice'

export function useAuth() {
    const { data: user, isLoading, error } = useGetUserQuery()

    const isAuthenticated = !!user && !error

    return {
        user,
        // Legacy support for components that expect packer/customer
        packer: user?.user_type === 'packer' ? user : null,
        customer: user?.user_type === 'customer' ? user : null,
        userType: user?.user_type || null,
        isAuthenticated,
        isLoading,
    }
}
