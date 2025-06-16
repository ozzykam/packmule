import { useGetMuleQuery } from "../app/apiSlice"
import GigList from "./GigList"
import GigListForMule from "./GigListForMule"
import SignInForm from "./SignInForm"

const GigMarketplace = () => {
    const { data: mule, isLoading: isMuleLoading} = useGetMuleQuery()

    if (isMuleLoading ) {
        return <div>Loading Gigs...</div>;
    }

    if (!mule) {
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

    return (
        <>
            <div>
                <GigListForMule />
            </div>
            <div>
                <GigList />
            </div>
        </>
    )
}

export default GigMarketplace;
