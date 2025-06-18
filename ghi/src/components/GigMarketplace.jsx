import { useAuth } from "../hooks/useAuth"
import GigList from "./GigList"
import GigListForPacker from "./GigListForPacker"
import SignInForm from "./SignInForm"

const GigMarketplace = () => {
    const { isAuthenticated, isLoading, userType, packer, customer } = useAuth()

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

    // If user is a customer, redirect them to their dashboard
    if (userType === 'customer') {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-800 mb-2">
                        Welcome, {customer?.username}!
                    </h2>
                    <p className="text-blue-600 mb-4">
                        As a customer, you can post moving jobs for packers to book.
                    </p>
                    <a 
                        href="/customer/dashboard" 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
                    >
                        Go to Customer Dashboard →
                    </a>
                </div>
            </div>
        )
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
