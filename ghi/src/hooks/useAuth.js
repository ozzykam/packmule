import { useGetPackerQuery, useGetCustomerQuery } from '../app/apiSlice'

export function useAuth() {
    const { data: packer, isLoading: packerLoading, error: packerError } = useGetPackerQuery()
    const { data: customer, isLoading: customerLoading, error: customerError } = useGetCustomerQuery()

    const user = packer || customer
    const isLoading = packerLoading || customerLoading
    const isAuthenticated = (!!packer && !packerError) || (!!customer && !customerError)

    return {
        user,
        packer,
        customer,
        userType: packer ? 'packer' : customer ? 'customer' : null,
        isAuthenticated,
        isLoading,
    }
}
