import { useGetPackerQuery } from '../app/apiSlice'

export function useAuth() {
    const { data: user, isLoading, error } = useGetPackerQuery()

    return {
        user,
        isAuthenticated: !!user && !error,
        isLoading,
    }
}
