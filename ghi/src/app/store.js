import { configureStore } from '@reduxjs/toolkit'
import { packmuleApi } from './apiSlice'


export const store = configureStore({
  reducer: {
    [packmuleApi.reducerPath]: packmuleApi.reducer
  },
  middleware: (getDefaulltMiddleware) =>
    getDefaulltMiddleware().concat(packmuleApi.middleware),
})

