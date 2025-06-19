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
        // UNIFIED AUTH ROUTES
        getUser: builder.query({
            query: () => ({ url: '/api/auth/authenticate' }),
            providesTags: ['User'],
        }),
        signout: builder.mutation({
            query: () => ({ url: '/api/auth/signout', method: 'DELETE' }),
            invalidatesTags: ['User'],
        }),
        
        // PACKER AUTH ROUTES
        signin: builder.mutation({
            query: (body) => ({
                url: '/api/auth/signin',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        signup: builder.mutation({
            query: (body) => ({
                url: '/api/auth/signup',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),

        // CUSTOMER AUTH ROUTES
        customerSignin: builder.mutation({
            query: (body) => ({
                url: '/api/customer/auth/signin',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        customerSignup: builder.mutation({
            query: (body) => ({
                url: '/api/customer/auth/signup',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),

        // GIG ROUTES
        getAllGigs: builder.query({
            query: () => ({ url: '/api/gigs' }),
            providesTags: ['Gigs'],
        }),
        createGig: builder.mutation({
            query: (body) => ({
                url: '/api/gigs',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Gigs'],
        }),
        getGigDetails: builder.query({
            query: (gigId) => ({ url: `/api/gig/${gigId}` }),
            providesTags: ['GigDetails'],
        }),
        listGigSpecialtiesForGigByGigId: builder.query({
            query: (gigId) => ({ url: `/api/gigs/${gigId}/specialtys` }),
        }),
        updateGig: builder.mutation({
            query: ({ gigId, body }) => ({
                url: `/api/gigs/${gigId}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Gigs', 'GigDetails'],
        }),
        deleteGig: builder.mutation({
            query: (gigId) => ({
                url: `/api/gigs/${gigId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Gigs'],
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

    }),
})

export const {
    useGetAllGigsQuery,
    useCreateGigMutation,
    useUpdateGigMutation,
    useDeleteGigMutation,
    useGetGigDetailsQuery,
    useListGigSpecialtiesForGigByGigIdQuery,
    // Unified auth hooks
    useGetUserQuery,
    useSignoutMutation,
    // Packer auth hooks
    useSigninMutation,
    useSignupMutation,
    // Customer auth hooks
    useCustomerSigninMutation,
    useCustomerSignupMutation,
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
} = packmuleApi
