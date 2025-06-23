import { useGetAllGigsQuery, useGetGigsForPackersListQuery, useListGigSpecialtiesForGigByGigIdQuery, useGetAllSpecialtysQuery } from "../app/apiSlice"
import { Link } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import GigFilters from './GigFilters'
import SpecialtyIcon from './SpecialtyIcon'

const GigList = () => {
    const { data: gigDetailList, isLoading: isGigDetailListLoading, refetch: refectchUseGetAllGigsQuery } = useGetAllGigsQuery()
    const { data: gigList, isLoading: isGigListLoading, refetch: refectchUseGetGigsForPackersQuery } = useGetGigsForPackersListQuery()
    const { data: specialties } = useGetAllSpecialtysQuery()
    
    const [filters, setFilters] = useState({
        zipCode: '',
        radius: 25,
        selectedSpecialties: [],
        priceMin: '',
        priceMax: ''
    })

    const [sortBy, setSortBy] = useState('newest')

    useEffect(() => {
        refectchUseGetAllGigsQuery()
        refectchUseGetGigsForPackersQuery()
    }, [refectchUseGetAllGigsQuery, refectchUseGetGigsForPackersQuery])

    // Helper function to calculate distance between zip codes (simplified)
    const calculateZipDistance = (zip1, zip2) => {
        // This is a simplified calculation - in production you'd use a proper geocoding service
        // For now, we'll do a basic string comparison
        if (!zip1 || !zip2) return 999
        
        // If exact match, distance is 0
        if (zip1 === zip2) return 0
        
        // If first 3 digits match, assume nearby (within 25 miles)
        if (zip1.substring(0, 3) === zip2.substring(0, 3)) return 15
        
        // If first 2 digits match, assume moderate distance
        if (zip1.substring(0, 2) === zip2.substring(0, 2)) return 50
        
        // Otherwise assume far
        return 100
    }

    // Filter and sort gigs based on current filters and sorting
    const filteredGigs = useMemo(() => {
        if (isGigDetailListLoading || isGigListLoading || !gigList || !gigDetailList) {
            return []
        }

        const bookedGigs = gigList.map(gig => gig.gig_id)
        let openGigs = gigDetailList.filter(gig => !bookedGigs.includes(gig.id))

        // Apply filters
        if (filters.zipCode) {
            openGigs = openGigs.filter(gig => {
                const gigZip = gig.pickup_location?.zip_code
                if (!gigZip) return false
                const distance = calculateZipDistance(filters.zipCode, gigZip)
                return distance <= filters.radius
            })
        }

        if (filters.priceMin) {
            openGigs = openGigs.filter(gig => gig.price >= parseFloat(filters.priceMin))
        }

        if (filters.priceMax) {
            openGigs = openGigs.filter(gig => gig.price <= parseFloat(filters.priceMax))
        }

        if (filters.selectedSpecialties.length > 0) {
            openGigs = openGigs.filter(gig => {
                if (!gig.specialties || gig.specialties.length === 0) return false
                
                // Check if gig has all selected specialties
                return filters.selectedSpecialties.every(specialtyId => 
                    gig.specialties.includes(specialtyId)
                )
            })
        }

        // Apply sorting
        const sortedGigs = [...openGigs].sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_on_date) - new Date(a.created_on_date)
                case 'oldest':
                    return new Date(a.created_on_date) - new Date(b.created_on_date)
                case 'price-low':
                    return a.price - b.price
                case 'price-high':
                    return b.price - a.price
                case 'distance':
                    if (!filters.zipCode) return 0
                    const distanceA = calculateZipDistance(filters.zipCode, a.pickup_location?.zip_code)
                    const distanceB = calculateZipDistance(filters.zipCode, b.pickup_location?.zip_code)
                    return distanceA - distanceB
                case 'boxes-low':
                    return parseInt(a.boxes) - parseInt(b.boxes)
                case 'boxes-high':
                    return parseInt(b.boxes) - parseInt(a.boxes)
                default:
                    return new Date(b.created_on_date) - new Date(a.created_on_date)
            }
        })

        return sortedGigs
    }, [gigDetailList, gigList, filters, sortBy, isGigDetailListLoading, isGigListLoading])

    if (isGigDetailListLoading || isGigListLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-gray-500">Loading Gigs...</div>
        </div>
    }

    // Add safety checks for undefined data
    if (!gigList || !gigDetailList) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-500">Unable to load gigs. Please try again later.</div>
        </div>
    }
    const featuredImage = (gig) => {
        const defaultImage = 'https://images01.military.com/sites/default/files/styles/full/public/2023-08/stock%20moving%20boxes%20and%20plants%201800%20x%201200.jpg';
        if (gig.images && gig.images.length > 1 && gig.featured_image_index !== null) {
            return gig.images[gig.featured_image_index]
        } else if (gig.images && gig.images.length === 1) {
            return gig.images[0];
        }
        return defaultImage;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gig Marketplace</h1>
                <p className="text-gray-600">Find moving gigs that match your skills and location</p>
            </div>

            {/* Filters */}
            <GigFilters onFiltersChange={setFilters} initialFilters={filters} />

            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{filteredGigs.length}</span> available gig{filteredGigs.length !== 1 ? 's' : ''}
                </div>
                {filteredGigs.length > 0 && (
                    <div className="text-sm text-gray-500 flex items-center">
                        <label htmlFor="sortBy" className="mr-2">Sort by:</label>
                        <select 
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border-gray-300 rounded text-sm px-2 py-1 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="boxes-low">Boxes: Low to High</option>
                            <option value="boxes-high">Boxes: High to Low</option>
                            {filters.zipCode && <option value="distance">Distance (closest first)</option>}
                        </select>
                    </div>
                )}
            </div>

            {/* Gigs Grid */}
            {filteredGigs.length > 0 ? (
                <div className="gigs-wrapper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredGigs.map(gig => (
                        <Link to={`/gig/${gig.id}`} className="no-hyperlink" key={gig.id}>
                            <div className="gig-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="card-body">
                                    <div className="aspect-w-16 aspect-h-9 mb-4">
                                        <img 
                                            src={featuredImage(gig)}
                                            alt={gig.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                    <div className="gig-card-details p-4">
                                        <div className="card-title text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {gig.title}
                                        </div>
                                        <div className="gig-card-detail-location text-sm text-gray-600 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {gig.pickup_location.city}, {gig.pickup_location.state}
                                        </div>
                                        <div className="gig-card-detail-boxes-price flex items-center justify-between">
                                            <div className="gig-card-detail-boxes text-sm text-gray-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                {gig.boxes} Boxes
                                            </div>
                                            <div className="gig-card-detail-price text-lg font-bold text-orange-600">
                                                ${gig.price}
                                            </div>
                                        </div>
                                        {/* Specialty indicators */}
                                        {gig.specialties && gig.specialties.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex flex-wrap" style={{ gap: '0.5em' }}>
                                                    {gig.specialties.slice(0, 4).map((specialtyId, index) => (
                                                        <SpecialtyIcon 
                                                            key={index}
                                                            specialtyId={specialtyId}
                                                            specialties={specialties}
                                                            showName={false}
                                                            size="sm"
                                                        />
                                                    ))}
                                                    {gig.specialties.length > 4 && (
                                                        <div className="inline-flex items-center justify-center w-6 h-6 p-1 rounded-full bg-gray-100 text-gray-600">
                                                            <span className="text-xs font-medium">+{gig.specialties.length - 4}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                /* No Results */
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0121 12a8 8 0 01-8 8 8 8 0 01-8-8 7.962 7.962 0 014-6.709V3a1 1 0 112 0v.291z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No gigs found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Try adjusting your filters or check back later for new gigs that match your criteria.
                    </p>
                    <button 
                        onClick={() => setFilters({ zipCode: '', radius: 25, selectedSpecialties: [], priceMin: '', priceMax: '' })}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 transition-colors duration-200"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default GigList;
