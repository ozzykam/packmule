import { useGetBookedGigsForPackerQuery, useGetUserQuery, useUpdateGigForPackerMutation } from "../app/apiSlice"
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'
import SignInForm from "./SignInForm"

const GigHistory = () => {
    const { data: bookedGigs, refetch } = useGetBookedGigsForPackerQuery()
    const {data: packer, isLoading: isPackerLoading } = useGetUserQuery()

    const [updateGigForPacker] = useUpdateGigForPackerMutation();
    const navigate = useNavigate();

    const handleMarkAsComplete = async (gigId) => {
        try {
            const data = {
                gig_status_id: 3
            }
            const updatedPacker = packer.id
            console.log(gigId)
            await updateGigForPacker({ gigId, body: data});
            refetch();
            navigate(`/packer/${updatedPacker}/gigs/pay`);
        } catch (error) {
            console.error(error);
        }
    };


    if (isPackerLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    console.log(bookedGigs)
    if (!packer) {
        return (
            <>
                <div className="mx-auto w-1/2 p-4">
                    <h1> Please log in or sign up to continue!</h1>
                </div>
                <div>
                    <SignInForm />
                    <SignInForm />
                </div>
            </>
        )
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
        return date.toLocaleDateString(undefined, options)
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        let hours = date.getHours()
        const minutes = date.getMinutes()
        const ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12
        hours = hours ? hours : 12
        const strMinutes = minutes < 10 ? '0' + minutes : minutes
        return hours + ':' + strMinutes + ' ' + ampm
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }


    return (
        <div className="p-10">
            <div>
                <h2 className="text-2xl font-bold mb-4">Your Gig History</h2>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-black-900 uppercase bg-gray-50 ">
                            <tr>
                                <th scope="col" className="px-6 py-3 border-b w-2/12">Job Title</th>
                                <th scope="col" className="px-6 py-3 border-b w-4/12">Description</th>
                                <th scope="col" className="px-6 py-3 border-b w-2/12">Location</th>
                                <th scope="col" className="px-6 py-3 border-b w-1/12">Date</th>
                                <th scope="col" className="px-6 py-3 border-b w-1/12">Time</th>
                                <th scope="col" className="text-right px-6 py-3 border-b w-2/12">Pay</th>
                            </tr>
                    </thead>
                    <tbody>
                        {bookedGigs ? bookedGigs.map(gig => (
                                <tr key={gig.id} className="hover:border-orange-500 rounded-lg hover:bg-gray-50">
                                    <td scope="col" className="px-6 py-3 border-b w-2/12 hover:underline text-orange-600">
                                    <Link to={`/gig/${gig.id}`} className="contents" >
                                        {gig.title}
                                    </Link>
                                    </td>
                                    <td scope="col" className="px-6 py-3 border-b w-4/12">{gig.description}</td>
                                    <td scope="col" className="px-6 py-3 border-b w-2/12">{gig.pickup_location.city}, {gig.pickup_location.state}</td>
                                    <td scope="col" className="px-6 py-3 border-b w-1/12">{formatDate(gig.pickup_date)}</td>
                                    <td scope="col" className="px-6 py-3 border-b w-1/12">{formatTime(gig.pickup_date)}</td>
                                    <td scope="col" className="text-right px-6 py-3 border-b  w-2/12">{formatCurrency(gig.price)}</td>
                                </tr>
                        )) : <tr><td colSpan="6" className="px-4 py-2 text-center">You have no gigs</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default GigHistory
