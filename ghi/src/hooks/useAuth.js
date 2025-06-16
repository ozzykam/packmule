import { useGetMuleQuery } from '../app/apiSlice'

export function useAuth() {
    const { data: user, isLoading, error } = useGetMuleQuery()

    return {
        user,
        isAuthenticated: !!user && !error,
        isLoading,
    }
}
