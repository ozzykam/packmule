import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import SignInForm from './components/SignInForm'
import SignUpForm from './components/SignUpForm'
import CustomerSignInForm from './components/CustomerSignInForm'
import CustomerSignUpForm from './components/CustomerSignUpForm'
import CustomerDashboard from './components/CustomerDashboard'
import GigMarketplace from './components/GigMarketplace'
import GigDetails from './components/GigDetails'
import SpecialtyList from './components/SpecialtyList'
import PackerSpecialtiesSelector from './components/PackerSpecialtiesSelector'
import PackerSpecialtiesEditor from './components/PackerSpecialtiesEditor'
import PackerProfile from './components/PackerProfile'
import EditPackerProfile from './components/EditPackerProfile'
import GigHistory from './components/GigHistory'
import PayHistory from './components/PayHistory'
import App from './App'
import { RequireAuth } from './components/RequireAuth'

import './index.css'
import { store } from './app/store'
import { Provider } from 'react-redux'

const BASE_URL = import.meta.env.BASE_URL
if (!BASE_URL) {
    throw new Error('BASE_URL is not defined')
}

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            children: [
                // PACKER AUTH ROUTES
                { path: 'signup', element: <SignUpForm /> },
                { path: 'signin', element: <SignInForm /> },

                // CUSTOMER AUTH ROUTES  
                { path: 'customer/signup', element: <CustomerSignUpForm /> },
                { path: 'customer/signin', element: <CustomerSignInForm /> },

                // CUSTOMER PROTECTED ROUTES
                {
                    path: 'customer/dashboard',
                    element: (
                        <RequireAuth>
                            <CustomerDashboard />
                        </RequireAuth>
                    ),
                },

                // ✅ PACKER PROTECTED ROUTES BELOW:
                {
                    index: true,
                    element: (
                        <RequireAuth>
                            <GigMarketplace />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'gig/:gigId',
                    element: (
                        <RequireAuth>
                            <GigDetails />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/gigs/booked',
                    element: (
                        <RequireAuth>
                            <GigHistory />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'specialtys',
                    element: (
                        <RequireAuth>
                            <SpecialtyList />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/:packerId/specialtys',
                    element: (
                        <RequireAuth>
                            <PackerSpecialtiesSelector />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/:packerId/specialtys/edit',
                    element: (
                        <RequireAuth>
                            <PackerSpecialtiesEditor />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/:packerId',
                    element: (
                        <RequireAuth>
                            <PackerProfile />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/edit',
                    element: (
                        <RequireAuth>
                            <EditPackerProfile />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/:packerId/gigs/pay',
                    element: (
                        <RequireAuth>
                            <PayHistory />
                        </RequireAuth>
                    ),
                },
            ],
        },
    ],
    { basename: BASE_URL }
)

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('root element was not found!')
}

const root = ReactDOM.createRoot(rootElement)
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
)
