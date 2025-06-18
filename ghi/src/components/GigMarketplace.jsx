import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import GigList from "./GigList"
import GigListForPacker from "./GigListForPacker"
import SignInForm from "./SignInForm"

const GigMarketplace = () => {
    const { isAuthenticated, isLoading, userType, packer, customer } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        // If user is a customer, redirect them to their dashboard
        if (userType === 'customer') {
            navigate('/customer/dashboard')
        }
    }, [userType, navigate])

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return (
            <>
                <div className="mx-auto w-1/2 p-4">
                    <h2 className="pl-20">
                        {' '}
                        Please log in or sign up to continue!
                    </h2>
                </div>
                <div className="">
                    <SignInForm />
                </div>
            </>
        )
    }

    // If user is a customer, they'll be redirected by useEffect
    if (userType === 'customer') {
        return null
    }

    return (
        <>
            <div>
                <GigListForPacker />
            </div>
            <div>
                <GigList />
            </div>
        </>
    )
}

export default GigMarketplace;
