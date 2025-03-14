import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import SignInForm from './components/SignInForm'
import SignUpForm from './components/SignUpForm'
import GigMarketplace from './components/GigMarketplace'
import GigDetails from './components/GigDetails'
import SpecialtyList from './components/specialtyList'
import MuleSpecialtiesSelector from './components/MuleSpecialtiesSelector'
import MuleSpecialtiesEditor from './components/MuleSpecialtiesEditor'
import MuleProfile from './components/MuleProfile'
import EditMuleProfile from './components/EditMuleProfile'
import GigHistory from './components/GigHistory'
import PayHistory from './components/PayHistory'
import App from './App'

import './index.css'
import { store } from './app/store'
import { Provider } from 'react-redux'

import './index.css'

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
                {
                    path: 'signup',
                    element: <SignUpForm />,
                },
                {
                    path: 'signin',
                    element: <SignInForm />,
                },
                {
                    index: true,
                    element: <GigMarketplace />,
                },
                {
                    path:'gig/:gigId',
                    element: <GigDetails />
                },
                {
                    path:'mule/gigs/booked',
                    element: <GigHistory />
                },
                {
                    path: 'specialtys',
                    element: <SpecialtyList/>,
                },
                {
                    path: 'mule/:muleId/specialtys',
                    element: <MuleSpecialtiesSelector/>,
                },
                {
                    path: 'mule/:muleId/specialtys/edit',
                    element: <MuleSpecialtiesEditor/>,
                },
                {
                    path: 'mule/:muleId',
                    element: <MuleProfile/>,
                },
                {
                    path: 'mule/edit',
                    element: <EditMuleProfile/>,
                },
                {
                    path: 'mule/:muleId/gigs/pay',
                    element: <PayHistory/>,
                },
            ],
        },
    ],
    {
        basename: BASE_URL,
    }
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
