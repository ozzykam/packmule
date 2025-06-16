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
        getMule: builder.query({
            query: () => ({ url: '/api/auth/authenticate' }),
            providesTags: ['Mule'],
        }),
        signout: builder.mutation({
            query: () => ({ url: '/api/auth/signout', method: 'DELETE' }),
            invalidatesTags: ['Mule'],
        }),
        signin: builder.mutation({
            query: (body) => ({
                url: '/api/auth/signin',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Mule'],
        }),
        signup: builder.mutation({
            query: (body) => ({
                url: '/api/auth/signup',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Mule'],
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
        addGigtoMule: builder.mutation({
            query: ({ gigId, body }) => ({
                url: `/api/mule/gigs/${gigId}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MuleGigs'],
        }),
        getAllGigsForMulesList: builder.query({
            query: () => ({ url: '/api/mule/gigs/all' }),
        }),
        getGigsForMulesList: builder.query({
            query: () => ({ url: '/api/mules/gigs' }),
        }),
        updateGigForMule: builder.mutation({
            query: ({ gigId, body }) => ({
                url: `/api/mule/gig/${gigId}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['MuleGigs'],
        }),
        deleteMuleFromGig: builder.mutation({
            query: ({ gigId }) => ({
                url: `/api/mule/gigs/${gigId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MuleGigs'],
        }),
        getBookedGigsForMule: builder.query({
            query: () => ({ url: '/api/mule/gigs/booked' }),
            providesTags: ['MuleGigs'],
        }),
        getGigsForMuleWithStatus: builder.query({
            query: (muleId) => ({ url: `/api/mule/${muleId}/gigs` }),
        }),

        // SPECIALTY ROUTES
        getAllSpecialtys: builder.query({
            query: () => ({ url: '/api/specialtys' }),
        }),
        listSpecialtiesForMule: builder.query({
            query: (muleId) => ({ url: `/api/mule/${muleId}/specialtys` }),
            providesTags: ['MuleSpecialtys'],
        }),
        addMuleSpecialty: builder.mutation({
            query: (body) => ({
                url: '/api/mule/specialtys',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MuleSpecialtys'],
        }),
        deleteMuleSpecialty: builder.mutation({
            query: ({ muleId, specialtyId }) => ({
                url: `/api/mule/${muleId}/specialtys/${specialtyId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MuleSpecialtys'],
        }),

        // MULE PROFILE ROUTES
        getMuleProfile: builder.query({
            query: () => ({ url: '/api/mule' }),
            providesTags: ['MuleProfile'],
        }),
        editMuleProfile: builder.mutation({
            query: (body) => ({
                url: 'api/mule/edit',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['MuleProfile'],
        }),
    }),
})

export const {
    useUpdateGigMutation,
    useGetAllGigsQuery,
    useGetGigDetailsQuery,
    useListGigSpecialtiesForGigByGigIdQuery,
    useGetMuleQuery,
    useSignoutMutation,
    useSigninMutation,
    useSignupMutation,
    useGetAllSpecialtysQuery,
    useListSpecialtiesForMuleQuery,
    useAddMuleSpecialtyMutation,
    useDeleteMuleSpecialtyMutation,
    useGetAllGigsForMulesListQuery,
    useGetGigsForMulesListQuery,
    useAddGigtoMuleMutation,
    useEditMuleProfileMutation,
    useGetMuleProfileQuery,
    useUpdateGigForMuleMutation,
    useGetBookedGigsForMuleQuery,
    useDeleteMuleFromGigMutation,
    useGetGigsForMuleWithStatusQuery,
} = packmuleApi
