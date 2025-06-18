import { useState, useEffect } from 'react'
import { useUpdateGigMutation, useGetAllSpecialtysQuery } from '../app/apiSlice'
import { useAuth } from '../hooks/useAuth'

const EditGigForm = ({ gig, onClose, onSuccess }) => {
    const { customer, isAuthenticated, isLoading: authLoading, userType } = useAuth()
    const [updateGig, updateGigStatus] = useUpdateGigMutation()
    const { data: specialties, isLoading: specialtiesLoading } = useGetAllSpecialtysQuery()

    const [form, setForm] = useState({
        title: '',
        price: '',
        boxes: '',
        description: '',
        pickup_location: {
            street_address: '',
            street_address_two: '',
            city: '',
            state: '',
            zip_code: ''
        },
        pickup_date: '',
        dropoff_location: {
            street_address: '',
            street_address_two: '',
            city: '',
            state: '',
            zip_code: ''
        },
        dropoff_date: '',
        specialties: [],
        images: []
    })

    const [selectedImages, setSelectedImages] = useState([])
    const [featuredImageIndex, setFeaturedImageIndex] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')

    // Populate form with existing gig data
    useEffect(() => {
        if (gig) {
            setForm({
                title: gig.title || '',
                price: gig.price?.toString() || '',
                boxes: gig.boxes || '',
                description: gig.description || '',
                pickup_location: {
                    street_address: gig.pickup_location?.street_address || '',
                    street_address_two: gig.pickup_location?.street_address_two || '',
                    city: gig.pickup_location?.city || '',
                    state: gig.pickup_location?.state || '',
                    zip_code: gig.pickup_location?.zip_code || ''
                },
                pickup_date: gig.pickup_date ? new Date(gig.pickup_date).toISOString().slice(0, 16) : '',
                dropoff_location: {
                    street_address: gig.dropoff_location?.street_address || '',
                    street_address_two: gig.dropoff_location?.street_address_two || '',
                    city: gig.dropoff_location?.city || '',
                    state: gig.dropoff_location?.state || '',
                    zip_code: gig.dropoff_location?.zip_code || ''
                },
                dropoff_date: gig.dropoff_date ? new Date(gig.dropoff_date).toISOString().slice(0, 16) : '',
                specialties: gig.specialties || [],
                images: gig.images || []
            })
            
            if (gig.images && gig.images.length > 0) {
                const imageData = gig.images.map((image, index) => ({
                    preview: image,
                    name: `Image ${index + 1}`,
                    file: null // Existing images don't have file objects
                }))
                setSelectedImages(imageData)
                setFeaturedImageIndex(gig.featured_image_index || 0)
            }
        }
    }, [gig])

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.includes('.')) {
            const [parent, child] = name.split('.')
            setForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }))
        } else {
            setForm(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSpecialtyChange = (specialtyId) => {
        setForm(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialtyId)
                ? prev.specialties.filter(id => id !== specialtyId)
                : [...prev.specialties, specialtyId]
        }))
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        
        if (selectedImages.length + files.length > 15) {
            setErrorMessage('Maximum 15 images allowed')
            return
        }

        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrorMessage('Each image must be less than 5MB')
                return
            }

            const reader = new FileReader()
            reader.onload = (event) => {
                const imageData = {
                    file,
                    preview: event.target.result,
                    name: file.name
                }
                setSelectedImages(prev => [...prev, imageData])
                setForm(prev => ({
                    ...prev,
                    images: [...prev.images, event.target.result]
                }))
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
        
        // Adjust featured image index if necessary
        if (index === featuredImageIndex) {
            setFeaturedImageIndex(0) // Reset to first image
        } else if (index < featuredImageIndex) {
            setFeaturedImageIndex(featuredImageIndex - 1) // Shift index down
        }
    }

    const setFeaturedImage = (index) => {
        setFeaturedImageIndex(index)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')

        // Check authentication state before submission
        if (authLoading) {
            setErrorMessage('Please wait while we verify your authentication...')
            return
        }

        if (!isAuthenticated || userType !== 'customer' || !customer) {
            setErrorMessage('You must be logged in as a customer to edit gigs')
            return
        }

        try {
            const gigData = {
                ...form,
                price: parseFloat(form.price),
                customer_id: customer.id,
                pickup_date: new Date(form.pickup_date).toISOString(),
                dropoff_date: new Date(form.dropoff_date).toISOString(),
                created_on_date: gig.created_on_date, // Keep original creation date
                featured_image_index: selectedImages.length > 0 ? featuredImageIndex : null
            }

            console.log('Updating gig data:', gigData)
            const result = await updateGig({ gigId: gig.id, body: gigData }).unwrap()
            console.log('Gig updated successfully:', result)
            onSuccess?.()
            onClose?.()
        } catch (err) {
            console.error('Update gig error:', err)
            setErrorMessage(err?.data?.detail || err?.message || 'Failed to update gig')
        }
    }

    // Show loading state while authentication is being verified
    if (authLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p>Verifying authentication...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Show error if not authenticated properly
    if (!isAuthenticated || userType !== 'customer' || !customer) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h2>
                        <p className="text-gray-700 mb-4">You must be logged in as a customer to edit gigs.</p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Moving Job</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {errorMessage && (
                        <div className="bg-red-100 border-l-4 border-red-500 rounded-md text-red-700 py-4 pl-6">
                            <p className="font-bold">Error</p>
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Apartment Move - 2 Bedroom"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget ($) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="500.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Boxes *
                            </label>
                            <input
                                type="text"
                                name="boxes"
                                value={form.boxes}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 20-30 boxes"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe your moving needs, special items, stairs, etc."
                            />
                        </div>
                    </div>

                    {/* Pickup Location */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="pickup_location.street_address"
                                    value={form.pickup_location.street_address}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apt/Unit (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="pickup_location.street_address_two"
                                    value={form.pickup_location.street_address_two}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="pickup_location.city"
                                    value={form.pickup_location.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State *
                                </label>
                                <input
                                    type="text"
                                    name="pickup_location.state"
                                    value={form.pickup_location.state}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ZIP Code *
                                </label>
                                <input
                                    type="text"
                                    name="pickup_location.zip_code"
                                    value={form.pickup_location.zip_code}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pickup Date *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="pickup_date"
                                    value={form.pickup_date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dropoff Location */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dropoff Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="dropoff_location.street_address"
                                    value={form.dropoff_location.street_address}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apt/Unit (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="dropoff_location.street_address_two"
                                    value={form.dropoff_location.street_address_two}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="dropoff_location.city"
                                    value={form.dropoff_location.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State *
                                </label>
                                <input
                                    type="text"
                                    name="dropoff_location.state"
                                    value={form.dropoff_location.state}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ZIP Code *
                                </label>
                                <input
                                    type="text"
                                    name="dropoff_location.zip_code"
                                    value={form.dropoff_location.zip_code}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dropoff Date *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="dropoff_date"
                                    value={form.dropoff_date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Specialties Selection */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Specialties</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Select any special equipment or expertise needed for your move (optional)
                        </p>
                        
                        {specialtiesLoading ? (
                            <div className="text-center py-4">Loading specialties...</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {specialties?.map((specialty) => (
                                    <label
                                        key={specialty.id}
                                        className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.specialties.includes(specialty.id)}
                                            onChange={() => handleSpecialtyChange(specialty.id)}
                                            className="text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            {specialty.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Upload photos of your space, special items, or anything that helps packers understand your needs. 
                            Maximum 15 photos, 5MB each.
                        </p>
                        
                        <div className="mb-4">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                            >
                                📸 Add Photos ({selectedImages.length}/15)
                            </label>
                        </div>

                        {selectedImages.length > 0 && (
                            <>
                                {selectedImages.length > 1 && (
                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm font-medium text-blue-900 mb-2">
                                            Select Featured Image (shown as banner)
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedImages.map((image, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setFeaturedImage(index)}
                                                    className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                                                        index === featuredImageIndex
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-100'
                                                    }`}
                                                >
                                                    Photo {index + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {selectedImages.map((image, index) => (
                                        <div key={index} className="relative">
                                            <div className={`relative ${index === featuredImageIndex ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                                                <img
                                                    src={image.preview}
                                                    alt={`Upload ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                {index === featuredImageIndex && (
                                                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                            Featured
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                            <p className="text-xs text-gray-500 mt-1 truncate">
                                                {image.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateGigStatus.isLoading || authLoading}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium disabled:opacity-50"
                        >
                            {authLoading ? 'Verifying...' : updateGigStatus.isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditGigForm