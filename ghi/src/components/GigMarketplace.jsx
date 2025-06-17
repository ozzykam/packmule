import { useGetPackerQuery } from "../app/apiSlice"
import GigList from "./GigList"
import GigListForPacker from "./GigListForPacker"
import SignInForm from "./SignInForm"

const GigMarketplace = () => {
    const { data: packer, isLoading: isPackerLoading} = useGetPackerQuery()

    if (isPackerLoading ) {
        return <div>Loading Gigs...</div>;
    }

    if (!packer) {
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
                <GigListForPacker />
            </div>
            <div>
                <GigList />
            </div>
        </>
    )
}

export default GigMarketplace;
