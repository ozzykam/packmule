import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

export const packmuleApi = createApi({
    reducerPath: 'packmuleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_HOST,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        // AUTH ROUTES
        getPacker: builder.query({
            query: () => ({ url: '/api/auth/authenticate' }),
            providesTags: ['Packer'],
        }),
        signout: builder.mutation({
            query: () => ({ url: '/api/auth/signout', method: 'DELETE' }),
            invalidatesTags: ['Packer'],
        }),
        signin: builder.mutation({
            query: (body) => ({
                url: '/api/auth/signin',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Packer'],
        }),
        signup: builder.mutation({
            query: (body) => ({
                url: '/api/auth/signup',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Packer'],
        }),

        // GIG ROUTES
        getAllGigs: builder.query({
            query: () => ({ url: '/api/gigs' }),
        }),
        getGigDetails: builder.query({
            query: (gigId) => ({ url: `/api/gig/${gigId}` }),
            providesTags: ['GigDetails'],
        }),
        listGigSpecialtiesForGigByGigId: builder.query({
            query: (gigId) => ({ url: `/api/gigs/${gigId}/specialtys` }),
        }),
        updateGig: builder.mutation({
            query: (gigId) => ({ url: `/api/gig/${gigId}` }),
            invalidatesTags: ['GigDetails'],
        }),
        addGigtoPacker: builder.mutation({
            query: ({ gigId, body }) => ({
                url: `/api/packer/gigs/${gigId}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['PackerGigs'],
        }),
        getAllGigsForPackersList: builder.query({
            query: () => ({ url: '/api/packer/gigs/all' }),
        }),
        getGigsForPackersList: builder.query({
            query: () => ({ url: '/api/packers/gigs' }),
        }),
        updateGigForPacker: builder.mutation({
            query: ({ gigId, body }) => ({
                url: `/api/packer/gig/${gigId}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['PackerGigs'],
        }),
        deletePackerFromGig: builder.mutation({
            query: ({ gigId }) => ({
                url: `/api/packer/gigs/${gigId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['PackerGigs'],
        }),
        getBookedGigsForPacker: builder.query({
            query: () => ({ url: '/api/packer/gigs/booked' }),
            providesTags: ['PackerGigs'],
        }),
        getGigsForPackerWithStatus: builder.query({
            query: (packerId) => ({ url: `/api/packer/${packerId}/gigs` }),
        }),

        // SPECIALTY ROUTES
        getAllSpecialtys: builder.query({
            query: () => ({ url: '/api/specialtys' }),
        }),
        listSpecialtiesForPacker: builder.query({
            query: (packerId) => ({ url: `/api/packer/${packerId}/specialtys` }),
            providesTags: ['PackerSpecialtys'],
        }),
        addPackerSpecialty: builder.mutation({
            query: (body) => ({
                url: '/api/packer/specialtys',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['PackerSpecialtys'],
        }),
        deletePackerSpecialty: builder.mutation({
            query: ({ packerId, specialtyId }) => ({
                url: `/api/packer/${packerId}/specialtys/${specialtyId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['PackerSpecialtys'],
        }),

        // PACKER PROFILE ROUTES
        getPackerProfile: builder.query({
            query: () => ({ url: '/api/packer' }),
            providesTags: ['PackerProfile'],
        }),
        editPackerProfile: builder.mutation({
            query: (body) => ({
                url: 'api/packer/edit',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['PackerProfile'],
        }),

        // CUSTOMER AUTH ROUTES
        getCustomer: builder.query({
            query: () => ({ url: '/api/customer/auth/authenticate' }),
            providesTags: ['Customer'],
        }),
        customerSignout: builder.mutation({
            query: () => ({ url: '/api/customer/auth/signout', method: 'DELETE' }),
            invalidatesTags: ['Customer'],
        }),
        customerSignin: builder.mutation({
            query: (body) => ({
                url: '/api/customer/auth/signin',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Customer'],
        }),
        customerSignup: builder.mutation({
            query: (body) => ({
                url: '/api/customer/auth/signup',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Customer'],
        }),
    }),
})

export const {
    useUpdateGigMutation,
    useGetAllGigsQuery,
    useGetGigDetailsQuery,
    useListGigSpecialtiesForGigByGigIdQuery,
    useGetPackerQuery,
    useSignoutMutation,
    useSigninMutation,
    useSignupMutation,
    useGetAllSpecialtysQuery,
    useListSpecialtiesForPackerQuery,
    useAddPackerSpecialtyMutation,
    useDeletePackerSpecialtyMutation,
    useGetAllGigsForPackersListQuery,
    useGetGigsForPackersListQuery,
    useAddGigtoPackerMutation,
    useEditPackerProfileMutation,
    useGetPackerProfileQuery,
    useUpdateGigForPackerMutation,
    useGetBookedGigsForPackerQuery,
    useDeletePackerFromGigMutation,
    useGetGigsForPackerWithStatusQuery,
    // Customer hooks
    useGetCustomerQuery,
    useCustomerSignoutMutation,
    useCustomerSigninMutation,
    useCustomerSignupMutation,
} = packmuleApi
