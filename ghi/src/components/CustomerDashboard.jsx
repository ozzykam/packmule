import { useGetCustomerQuery, useGetAllGigsQuery } from '../app/apiSlice'

const CustomerDashboard = () => {
    const { data: customer, isLoading: customerLoading } = useGetCustomerQuery()
    const { data: gigs, isLoading: gigsLoading } = useGetAllGigsQuery()

    if (customerLoading) return <div>Loading customer data...</div>

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold text-white">
                    Welcome back, {customer?.username}!
                </h1>
                <p className="text-blue-100 mt-2">
                    Find reliable packers for your moving needs
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">📦</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Available Gigs</h3>
                            <p className="text-2xl font-bold text-blue-600">
                                {gigsLoading ? '...' : gigs?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">✓</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Your Bookings</h3>
                            <p className="text-2xl font-bold text-green-600">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">$</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Total Spent</h3>
                            <p className="text-2xl font-bold text-orange-600">$0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Services */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Available Moving Services</h2>
                    <p className="text-gray-600">Browse and book professional packing services</p>
                </div>

                <div className="p-6">
                    {gigsLoading ? (
                        <div className="text-center py-8">Loading available services...</div>
                    ) : gigs && gigs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gigs.slice(0, 6).map((gig) => (
                                <div key={gig.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {gig.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {gig.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-blue-600">
                                            ${gig.price}
                                        </span>
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        {gig.boxes} boxes • {new Date(gig.pickup_date).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No moving services available at the moment
                        </div>
                    )}
                </div>

                {gigs && gigs.length > 6 && (
                    <div className="px-6 py-4 border-t border-gray-200 text-center">
                        <button className="text-blue-500 hover:text-blue-600 font-medium">
                            View All Services →
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors">
                            <div className="text-2xl mb-2">🔍</div>
                            <div className="font-medium text-blue-900">Browse Services</div>
                            <div className="text-sm text-blue-600">Find moving help</div>
                        </button>
                        
                        <button className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors">
                            <div className="text-2xl mb-2">📅</div>
                            <div className="font-medium text-green-900">Schedule Move</div>
                            <div className="text-sm text-green-600">Book a packer</div>
                        </button>
                        
                        <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors">
                            <div className="text-2xl mb-2">👤</div>
                            <div className="font-medium text-purple-900">My Profile</div>
                            <div className="text-sm text-purple-600">Update info</div>
                        </button>
                        
                        <button className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-center transition-colors">
                            <div className="text-2xl mb-2">💬</div>
                            <div className="font-medium text-orange-900">Support</div>
                            <div className="text-sm text-orange-600">Get help</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerDashboard