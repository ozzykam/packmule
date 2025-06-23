import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
    useGetGigDetailsQuery,
    useGetUserQuery,
    useListGigSpecialtiesForGigByGigIdQuery,
    useListSpecialtiesForPackerQuery,
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
    const { data: packerSpecialties, isLoading: isPackerSpecialtiesLoading } = useListSpecialtiesForPackerQuery(packer?.id, {
        skip: !packer?.id // Skip query if no packer ID
    })
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

    if (isGigLoading || isSpecialtyLoading || isPackerLoading || isPackerSpecialtiesLoading) {
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

    // Check if packer has all required specialties
    const hasAllRequiredSpecialties = () => {
        if (!specialtys_data || !packerSpecialties) return true // If no requirements, allow booking
        
        const requiredSpecialtyIds = new Set(specialtys_data.map(s => s.specialty_id))
        const packerSpecialtyIds = new Set(packerSpecialties.map(s => s.specialty_id))
        
        // Check if all required specialties are in packer's specialties
        return [...requiredSpecialtyIds].every(id => packerSpecialtyIds.has(id))
    }

    // Get missing specialties for display
    const getMissingSpecialties = () => {
        if (!specialtys_data || !packerSpecialties) return []
        
        const requiredSpecialtyIds = new Set(specialtys_data.map(s => s.specialty_id))
        const packerSpecialtyIds = new Set(packerSpecialties.map(s => s.specialty_id))
        
        return specialtys_data.filter(specialty => 
            !packerSpecialtyIds.has(specialty.specialty_id)
        )
    }

    const canBookGig = hasAllRequiredSpecialties()
    const missingSpecialties = getMissingSpecialties()

    // Debug logging
    console.log('Debug Specialty Matching:', {
        specialtys_data,
        packerSpecialties,
        canBookGig,
        missingSpecialties,
        packer
    })

    // Helper function to check if packer has a specific specialty
    const packerHasSpecialty = (specialtyId) => {
        if (!packerSpecialties) return false
        return packerSpecialties.some(s => s.specialty_id === specialtyId)
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
                                                (specialty, counter) => {
                                                    const hasSpecialty = packerHasSpecialty(specialty.specialty_id)
                                                    return (
                                                        <li
                                                            key={specialty.id}
                                                            className={`py-2 px-4 mb-8 rounded-full focus:outline-none
                                                            focus:shadow-outline flex items-center gap-2
                                                            ${hasSpecialty 
                                                                ? 'bg-green-600 text-white' 
                                                                : 'bg-red-500 text-white'
                                                            }`}
                                                        >
                                                            {hasSpecialty ? '✓' : '✗'}
                                                            {specialty.specialty_name}
                                                        </li>
                                                    )
                                                }
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
                                                (specialty, counter) => {
                                                    const hasSpecialty = packerHasSpecialty(specialty.specialty_id)
                                                    return (
                                                        <li
                                                            key={specialty.id}
                                                            className={`py-2 px-4 mb-8 rounded-full focus:outline-none
                                                            focus:shadow-outline flex items-center gap-2
                                                            ${hasSpecialty 
                                                                ? 'bg-green-600 text-white' 
                                                                : 'bg-red-500 text-white'
                                                            }`}
                                                        >
                                                            {hasSpecialty ? '✓' : '✗'}
                                                            {specialty.specialty_name}
                                                        </li>
                                                    )
                                                }
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
                                            (specialty, counter) => {
                                                const hasSpecialty = packerHasSpecialty(specialty.specialty_id)
                                                return (
                                                    <li
                                                        key={specialty.id}
                                                        className={`py-2 px-4 mb-8 rounded-full focus:outline-none
                                                        focus:shadow-outline flex items-center gap-2
                                                        ${hasSpecialty 
                                                            ? 'bg-green-600 text-white' 
                                                            : 'bg-red-500 text-white'
                                                        }`}
                                                    >
                                                        {hasSpecialty ? '✓' : '✗'}
                                                        {specialty.specialty_name}
                                                    </li>
                                                )
                                            }
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
                            
                            {/* Missing Specialties Warning */}
                            {!canBookGig && missingSpecialties.length > 0 && (
                                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <span className="text-red-400">⚠️</span>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700 font-medium">
                                                Missing Required Specialties:
                                            </p>
                                            <ul className="text-sm text-red-600 mt-1 list-disc list-inside">
                                                {missingSpecialties.map(specialty => (
                                                    <li key={specialty.specialty_id}>
                                                        {specialty.specialty_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
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
                                        onClick={canBookGig ? handleBookGig : undefined}
                                        disabled={!canBookGig}
                                        className={`font-bold py-4 px-8 rounded-full focus:outline-none
                                        focus:shadow-outline transition duration-200 ease-in-out
                                        ${canBookGig 
                                            ? 'bg-gradient-to-br from-orange-600 to-orange-400 text-white shadow-[0_10px_20px_-9px_rgba(227,136,0,1)] hover:brightness-[1.05] hover:scale-[1.03] hover:shadow-[0_35px_60px_-9px_rgba(227,136,0,0.7)]' 
                                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        }`}
                                    >
                                        {canBookGig ? 'Book Gig!' : 'Missing Specialties'}
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
