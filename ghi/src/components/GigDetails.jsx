import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
    useGetGigDetailsQuery,
    useGetUserQuery,
    useListGigSpecialtiesForGigByGigIdQuery,
    useGetGigsForPackersListQuery,
    useAddGigtoPackerMutation,
    useDeletePackerFromGigMutation,
} from '../app/apiSlice'
import ImageCarousel from './ImageCarousel'
import ImageStack from './ImageStack'

const GigDetails = () => {
    const params = useParams()
    const { data: packer, isLoading: isPackerLoading } = useGetUserQuery()
    const { data: gig_data, isLoading: isGigLoading } = useGetGigDetailsQuery(params.gigId)
    const { data: gigs_for_packers_data, refetch: refectchUseGetGigsForPackers } = useGetGigsForPackersListQuery(params.gigId)
    const { data: specialtys_data, isLoading: isSpecialtyLoading } = useListGigSpecialtiesForGigByGigIdQuery(params.gigId)
    const [ isBooked, setIsBooked ] = useState(false)
    const [ showCarousel, setShowCarousel ] = useState(false)
    const [ carouselStartIndex, setCarouselStartIndex ] = useState(0)
    const [ bookGig ] = useAddGigtoPackerMutation()
    const [ cancelGig ] = useDeletePackerFromGigMutation()

    useEffect(() => {
        if (gigs_for_packers_data && gig_data) {
            const booked = gigs_for_packers_data.some(gig => gig.gig_id === gig_data.id && gig.gig_status_id !== 1);
            setIsBooked(booked);
        }
    }, [gigs_for_packers_data, gig_data])

    if (isGigLoading || isSpecialtyLoading || isPackerLoading) {
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
        await bookGig({ packerId: packer.id, gigId: params.gigId }).unwrap()
        setIsBooked(true)
        refectchUseGetGigsForPackers()
    }

    const handleCancelGig = async () => {
        await cancelGig({ gigId: params.gigId }).unwrap()
        setIsBooked(false)
        refectchUseGetGigsForPackers()
    }

    const handleImageClick = (index) => {
        setCarouselStartIndex(index)
        setShowCarousel(true)
    }

    const handleViewMoreImages = () => {
        setCarouselStartIndex(0)
        setShowCarousel(true)
    }

    // Get images and featured image info
    const images = gig_data?.images || []
    const featuredIndex = gig_data?.featured_image_index ?? 0
    const featuredImage = images.length > 0 ? images[featuredIndex] : null

    return (
        <>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Featured Image Banner */}
                <div className="relative mb-8">
                    {featuredImage ? (
                        <div 
                            className="w-full h-80 rounded-lg overflow-hidden cursor-pointer shadow-lg"
                            onClick={() => handleImageClick(featuredIndex)}
                        >
                            <img
                                src={featuredImage}
                                alt={gig_data.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-80 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                            <div className="text-center text-white">
                                <div className="text-6xl mb-4">📦</div>
                                <h2 className="text-2xl font-semibold">Moving Job</h2>
                                <p className="text-orange-100">No photos provided</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Image Stack for additional photos */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 right-4">
                            <ImageStack
                                images={images}
                                featuredIndex={featuredIndex}
                                onViewMore={handleViewMoreImages}
                            />
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">{gig_data.title}</h1>
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

            {/* Image Carousel Modal */}
            {showCarousel && (
                <ImageCarousel
                    images={images}
                    initialIndex={carouselStartIndex}
                    onClose={() => setShowCarousel(false)}
                />
            )}
        </>
    )
}

export default GigDetails
