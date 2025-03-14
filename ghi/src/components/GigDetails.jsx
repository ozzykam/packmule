import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
    useGetGigDetailsQuery,
    useGetMuleQuery,
    useListGigSpecialtiesForGigByGigIdQuery,
    useGetGigsForMulesListQuery,
    useAddGigtoMuleMutation,
    useDeleteMuleFromGigMutation,
} from '../app/apiSlice'

const GigDetails = () => {
    const params = useParams()
    const { data: mule, isLoading: isMuleLoading } = useGetMuleQuery()
    const { data: gig_data, isLoading: isGigLoading } = useGetGigDetailsQuery(params.gigId)
    const { data: gigs_for_mules_data, refetch: refectchUseGetGigsForMules } = useGetGigsForMulesListQuery(params.gigId)
    const { data: specialtys_data, isLoading: isSpecialtyLoading } = useListGigSpecialtiesForGigByGigIdQuery(params.gigId)
    const [ isBooked, setIsBooked ] = useState(false)
    const [ bookGig ] = useAddGigtoMuleMutation()
    const [ cancelGig ] = useDeleteMuleFromGigMutation()

    useEffect(() => {
        if (gigs_for_mules_data && gig_data) {
            const booked = gigs_for_mules_data.some(gig => gig.gig_id === gig_data.id && gig.gig_status_id !== 1);
            setIsBooked(booked);
        }
    }, [gigs_for_mules_data, gig_data])

    if (isGigLoading || isSpecialtyLoading || isMuleLoading) {
        return <div>Loading...</div>
    }

    let equipmentSpecialties = []
    let experienceSpecialties = []
    let vehicleSpecialties = []


    if (specialtys_data && specialtys_data.length > 0) {
        equipmentSpecialties = specialtys_data.filter(
            (specialty) => specialty.specialty_type_id === 1
        )
        experienceSpecialties = specialtys_data.filter(
            (specialty) => specialty.specialty_type_id === 2
        )
        vehicleSpecialties = specialtys_data.filter(
            (specialty) => specialty.specialty_type_id === 3
        )
    }

    const handleBookGig = async () => {
        await bookGig({ muleId: mule.id, gigId: params.gigId }).unwrap()
        setIsBooked(true)
        refectchUseGetGigsForMules()
    }

    const handleCancelGig = async () => {
        await cancelGig({ gigId: params.gigId }).unwrap()
        setIsBooked(false)
        refectchUseGetGigsForMules()
    }
    console.log(params.gigId)

    return (
        <>
            <div className="flex justify-center outline-gray-100">
                <div className="bg-white rounded w-3/4 px-10 pb-8 m-9">
                    <div>
                        <h1 className="pl-0 pb-2">{gig_data.title}</h1>
                    </div>
                    <div className="flex justify-start outline-gray-100 w-full">
                        <div className="bg-white rounded w-1/2 mr-2 my-9">
                            <img
                                src="https://images01.military.com/sites/default/files/styles/full/public/2023-08/stock%20moving%20boxes%20and%20plants%201800%20x%201200.jpg"
                                alt="Gig"
                                className="h-full rounded-l-lg"
                            />
                        </div>
                        <div className="span bg-white rounded w-1/4 my-9 mr-2">
                            <img
                                src="https://images01.military.com/sites/default/files/styles/full/public/2023-08/stock%20moving%20boxes%20and%20plants%201800%20x%201200.jpg"
                                alt="Gig"
                                className="w-full mr-2 mb-2"
                            />
                            <img
                                src="https://images01.military.com/sites/default/files/styles/full/public/2023-08/stock%20moving%20boxes%20and%20plants%201800%20x%201200.jpg"
                                alt="Gig"
                                className="w-full"
                            />
                        </div>
                        <div className="span bg-white rounded w-1/4 my-9">
                            <img
                                src="https://images01.military.com/sites/default/files/styles/full/public/2023-08/stock%20moving%20boxes%20and%20plants%201800%20x%201200.jpg"
                                alt="Gig"
                                className="w-full mr-2 mb-2 rounded-tr-lg"
                            />
                            <img
                                src="https://images01.military.com/sites/default/files/styles/full/public/2023-08/stock%20moving%20boxes%20and%20plants%201800%20x%201200.jpg"
                                alt="Gig"
                                className="w-full rounded-br-lg"
                            />
                        </div>
                    </div>



                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <div className="flex flex-wrap">
                                <div>
                                    <h2 className="pr-20 pb-2 font-semibold">
                                        Pick-Up:
                                    </h2>
                                    <p>
                                        {gig_data.pickup_location.city},{' '}
                                        {gig_data.pickup_location.state}{' '}
                                        {gig_data.pickup_location.zip_code}
                                    </p>
                                </div>
                                <div>
                                    <h2 className="pb-2 font-semibold">Drop-Off:</h2>
                                    <p>
                                        {gig_data.dropoff_location.city},{' '}
                                        {gig_data.dropoff_location.state}{' '}
                                        {gig_data.dropoff_location.zip_code}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h2 className="font-semibold pt-8">
                                    Specialty Requirements:
                                </h2>
                                {equipmentSpecialties.length > 0 && (
                                    <>
                                        <div className="font-semibold pb-4">
                                            Equipment
                                        </div>
                                        <p className="gig_specialty_list_horizontal">
                                            {equipmentSpecialties.map(
                                                (specialty, counter) => (
                                                    <li
                                                        key={specialty.id}
                                                        className="bg-gray-950 text-white
                                                py-2 px-4 mb-8 rounded-full focus:outline-none
                                                focus:shadow-outline"
                                                    >
                                                        {
                                                            specialty.specialty_name
                                                        }
                                                        {counter <
                                                            equipmentSpecialties.length -
                                                                1 && ''}
                                                    </li>
                                                )
                                            )}
                                        </p>
                                    </>
                                )}
                                {experienceSpecialties.length > 0 && (
                                    <>
                                        <div className="font-semibold pb-4">
                                        Experience
                                        </div>
                                        <p className="gig_specialty_list_horizontal">
                                            {experienceSpecialties.map(
                                                (specialty, counter) => (
                                                    <li
                                                        key={specialty.id}
                                                        className="bg-gray-950 text-white
                                                    py-2 px-4 mb-8 rounded-full focus:outline-none
                                                    focus:shadow-outline"
                                                    >
                                                        {specialty.specialty_name}
                                                        {counter <
                                                            experienceSpecialties.length -
                                                                1 && ''}
                                                    </li>
                                                )
                                            )}
                                        </p>
                                    </>
                                )}
                                {vehicleSpecialties.length > 0 && (
                                    <>
                                    <div className="font-semibold pb-4">
                                    Vehicle
                                    </div>
                                    <p className="gig_specialty_list_horizontal">
                                        {vehicleSpecialties.map(
                                            (specialty, counter) => (
                                                <li
                                                    key={specialty.id}
                                                    className="bg-gray-950 text-white
                                                py-2 px-4 mb-8 rounded-full focus:outline-none
                                                focus:shadow-outline"
                                                >
                                                    {specialty.specialty_name}
                                                    {counter <
                                                        vehicleSpecialties.length -
                                                            1 && ''}
                                                </li>
                                            )
                                        )}
                                    </p>
                                    </>
                                )}
                                {equipmentSpecialties.length === 0 &&
                                    experienceSpecialties.length === 0 &&
                                    vehicleSpecialties.length === 0 && (
                                        <p className="pb-8">No specialties required</p>
                                    )}
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <h1 className="pl-0 flex justify-end">
                                ${gig_data.price}
                            </h1>
                            <div className="flex justify-end">
                                {isBooked ? (
                                    <>
                                        <button
                                            onClick={handleCancelGig}
                                            className="bg-gradient-to-br from-red-600 to-red-400 text-white
                                            shadow-[0_10px_20px_-9px_rgba(255,0,0,0.9)]
                                            font-bold py-4 px-8 rounded-full focus:outline-none
                                            focus:shadow-outline hover:brightness-[1.05] hover:scale-[1.03]
                                            hover:shadow-[0_35px_60px_-9px_rgba(255,0,0,0.7)]
                                            transition duration-200 ease-in-out"
                                        >
                                            Cancel Gig
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleBookGig}
                                        className="bg-gradient-to-br from-orange-600 to-orange-400 text-white
                                        font-bold py-4 px-8 rounded-full shadow-[0_10px_20px_-9px_rgba(227,136,0,1)] focus:outline-none
                                        focus:shadow-outline hover:brightness-[1.05] hover:scale-[1.03]
                                        hover:shadow-[0_35px_60px_-9px_rgba(227,136,0,0.7)]
                                        transition duration-200 ease-in-out"
                                    >
                                        Book Gig!
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GigDetails
