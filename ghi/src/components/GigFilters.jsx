import { useState, useEffect } from 'react'
import { useGetAllSpecialtysQuery } from '../app/apiSlice'
import SpecialtyIcon from './SpecialtyIcon'

const GigFilters = ({ onFiltersChange, initialFilters = {} }) => {
    const { data: specialties, isLoading: isSpecialtiesLoading } = useGetAllSpecialtysQuery()
    
    const [filters, setFilters] = useState({
        zipCode: initialFilters.zipCode || '',
        radius: initialFilters.radius || 25,
        selectedSpecialties: initialFilters.selectedSpecialties || [],
        priceMin: initialFilters.priceMin || '',
        priceMax: initialFilters.priceMax || '',
        ...initialFilters
    })

    const [isExpanded, setIsExpanded] = useState(false)

    // Group specialties by type
    const groupedSpecialties = specialties?.reduce((acc, specialty) => {
        const typeId = specialty.specialty_type_id
        if (!acc[typeId]) {
            acc[typeId] = []
        }
        acc[typeId].push(specialty)
        return acc
    }, {}) || {}

    const specialtyTypeNames = {
        1: 'Equipment',
        2: 'Experience', 
        3: 'Vehicle'
    }

    const radiusOptions = [5, 10, 15, 25, 50, 100]

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFiltersChange(newFilters)
    }

    const handleSpecialtyToggle = (specialtyId) => {
        const selectedSpecialties = filters.selectedSpecialties.includes(specialtyId)
            ? filters.selectedSpecialties.filter(id => id !== specialtyId)
            : [...filters.selectedSpecialties, specialtyId]
        
        handleFilterChange('selectedSpecialties', selectedSpecialties)
    }

    const clearAllFilters = () => {
        const clearedFilters = {
            zipCode: '',
            radius: 25,
            selectedSpecialties: [],
            priceMin: '',
            priceMax: ''
        }
        setFilters(clearedFilters)
        onFiltersChange(clearedFilters)
    }

    const hasActiveFilters = filters.zipCode || filters.selectedSpecialties.length > 0 || filters.priceMin || filters.priceMax

    if (isSpecialtiesLoading) {
        return <div className="p-4">Loading filters...</div>
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            {/* Filter Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Filter Gigs</h3>
                    {hasActiveFilters && (
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {filters.selectedSpecialties.length + (filters.zipCode ? 1 : 0) + (filters.priceMin || filters.priceMax ? 1 : 0)} active
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                            Clear all
                        </button>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <svg 
                            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Filter Content */}
            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="p-4 space-y-6">
                    {/* Location Filters */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Location</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Zip Code
                                </label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    value={filters.zipCode}
                                    onChange={(e) => handleFilterChange('zipCode', e.target.value)}
                                    placeholder="Enter zip code"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                                    Radius (miles)
                                </label>
                                <select
                                    id="radius"
                                    value={filters.radius}
                                    onChange={(e) => handleFilterChange('radius', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                >
                                    {radiusOptions.map(radius => (
                                        <option key={radius} value={radius}>
                                            {radius} miles
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Price Filters */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span>Price Range</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Price
                                </label>
                                <input
                                    type="number"
                                    id="priceMin"
                                    value={filters.priceMin}
                                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                                    placeholder="$0"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Price
                                </label>
                                <input
                                    type="number"
                                    id="priceMax"
                                    value={filters.priceMax}
                                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                                    placeholder="No limit"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Specialty Filters */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Required Specialties</span>
                        </h4>
                        <div className="space-y-4">
                            {Object.entries(groupedSpecialties).map(([typeId, specialtyList]) => (
                                <div key={typeId} className="space-y-2">
                                    <h5 className="text-sm font-medium text-gray-800 border-b border-gray-200 pb-1">
                                        {specialtyTypeNames[typeId]}
                                    </h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {specialtyList.map(specialty => (
                                            <label
                                                key={specialty.id}
                                                className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                                                    filters.selectedSpecialties.includes(specialty.id)
                                                        ? 'bg-orange-50 border border-orange-200'
                                                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={filters.selectedSpecialties.includes(specialty.id)}
                                                    onChange={() => handleSpecialtyToggle(specialty.id)}
                                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                />
                                                <SpecialtyIcon 
                                                    specialtyName={specialty.name} 
                                                    showName={true}
                                                    size="sm"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GigFilters