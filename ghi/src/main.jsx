import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import HomePage from './components/HomePage'
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
                { path: 'packer/signup', element: <SignUpForm /> },
                { path: 'packer/signin', element: <SignInForm /> },

                // CUSTOMER AUTH ROUTES  
                { path: 'customer/signup', element: <CustomerSignUpForm /> },
                { path: 'customer/signin', element: <CustomerSignInForm /> },

                // CUSTOMER PROTECTED ROUTES
                {
                    path: 'customer/dashboard',
                    element: (
                        <RequireAuth userType="customer">
                            <CustomerDashboard />
                        </RequireAuth>
                    ),
                },

                // HOME PAGE (Default route)
                {
                    index: true,
                    element: <HomePage />
                },

                // ✅ PACKER PROTECTED ROUTES BELOW:
                {
                    path: 'marketplace',
                    element: (
                        <RequireAuth userType="packer">
                            <GigMarketplace />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'gig/:gigId',
                    element: (
                        <RequireAuth userType="packer">
                            <GigDetails />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/gigs/booked',
                    element: (
                        <RequireAuth userType="packer">
                            <GigHistory />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'specialtys',
                    element: (
                        <RequireAuth userType="packer">
                            <SpecialtyList />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/:packerId/specialtys',
                    element: (
                        <RequireAuth userType="packer">
                            <PackerSpecialtiesSelector />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/:packerId/specialtys/edit',
                    element: (
                        <RequireAuth userType="packer">
                            <PackerSpecialtiesEditor />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/:packerId',
                    element: (
                        <RequireAuth userType="packer">
                            <PackerProfile />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/edit',
                    element: (
                        <RequireAuth userType="packer">
                            <EditPackerProfile />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'packer/:packerId/gigs/pay',
                    element: (
                        <RequireAuth userType="packer">
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
