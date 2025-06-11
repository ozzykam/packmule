import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../utils/auth'

export const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

export const packmuleApi = createApi({
    reducerPath: 'packmuleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_HOST,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = getToken()
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: (builder) => ({
        // AUTH ROUTES
        getMule: builder.query({
            query: () => ({ url: '/api/auth/authenticate' }),
            providesTags: ['Mule'],
        }),
        signout: builder.mutation({
            query: () => ({
                url: '/api/auth/signout',
                method: 'DELETE',
            }),
            invalidatesTags: ['Mule'],
        }),
        signin: builder.mutation({
            query: (body) => ({
                url: '/api/auth/signin',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Mule'],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    if (data.token) {
                        localStorage.setItem('token', data.token)
                    }
                } catch (err) {
                    console.error('Signin error:', err)
                }
            },
        }),
        signup: builder.mutation({
            query: (body) => ({
                url: '/api/auth/signup',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Mule'],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    if (data.token) {
                        localStorage.setItem('token', data.token)
                    }
                } catch (err) {
                    console.error('Signup error:', err)
                }
            },
        }),

        // GIG ROUTES
        getAllGigs: builder.query({
            query: () => ({ url: '/api/gigs' }),
        }),
        getGigDetails: builder.query({
            query: (gigId) => ({ url: `/api/gigs/${gigId}` }),
            providesTags: ['GigDetails'],
        }),
        addGigToMule: builder.mutation({
            query: ({ gigId, body }) => ({
                url: `/api/gigs/${gigId}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MuleGigs'],
        }),
        removeGigFromMule: builder.mutation({
            query: ({ gigId }) => ({
                url: `/api/gigs/${gigId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MuleGigs'],
        }),

        // SPECIALTYS ROUTES
        getAllSpecialtys: builder.query({
            query: () => ({ url: '/api/specialtys' }),
        }),
        getSpecialtysForMule: builder.query({
            query: (muleId) => ({ url: `/api/specialtys/mule/${muleId}` }),
            providesTags: ['MuleSpecialtys'],
        }),
        addMuleSpecialty: builder.mutation({
            query: (body) => ({
                url: '/api/specialtys/mule',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MuleSpecialtys'],
        }),
        deleteMuleSpecialty: builder.mutation({
            query: ({ muleId, specialtyId }) => ({
                url: `/api/specialtys/mule/${muleId}/${specialtyId}`,
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
                url: '/api/mule/edit',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['MuleProfile'],
        }),
        listAllMules: builder.query({
            query: () => ({ url: '/api/mule/all' }),
        }),
    }),
})

export const {
    useGetMuleQuery,
    useSignoutMutation,
    useSigninMutation,
    useSignupMutation,
    useGetAllGigsQuery,
    useGetGigDetailsQuery,
    useAddGigToMuleMutation,
    useRemoveGigFromMuleMutation,
    useGetAllSpecialtysQuery,
    useGetSpecialtysForMuleQuery,
    useAddMuleSpecialtyMutation,
    useDeleteMuleSpecialtyMutation,
    useGetMuleProfileQuery,
    useEditMuleProfileMutation,
    useListAllMulesQuery,
} = packmuleApi
