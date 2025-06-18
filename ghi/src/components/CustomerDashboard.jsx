import { useState } from 'react'
import { useGetCustomerQuery, useGetAllGigsQuery, useDeleteGigMutation } from '../app/apiSlice'
import CreateGigForm from './CreateGigForm'
import EditGigForm from './EditGigForm'

const CustomerDashboard = () => {
    const { data: customer, isLoading: customerLoading } = useGetCustomerQuery()
    const { data: allGigs, isLoading: gigsLoading, refetch: refetchGigs } = useGetAllGigsQuery()
    const [deleteGig, deleteGigStatus] = useDeleteGigMutation()
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingGig, setEditingGig] = useState(null)
    const [deletingGigId, setDeletingGigId] = useState(null)

    // Filter gigs to show only those created by this customer
    const customerGigs = allGigs?.filter(gig => gig.customer_id === customer?.id) || []

    if (customerLoading) return <div>Loading customer data...</div>

    const handleGigCreated = () => {
        refetchGigs()
    }

    const handleGigUpdated = () => {
        refetchGigs()
        setEditingGig(null)
    }

    const handleDeleteGig = async (gigId) => {
        if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            try {
                setDeletingGigId(gigId)
                await deleteGig(gigId).unwrap()
                refetchGigs()
            } catch (err) {
                console.error('Delete gig error:', err)
                alert('Failed to delete job. Please try again.')
            } finally {
                setDeletingGigId(null)
            }
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold text-white">
                    Welcome back, {customer?.username}!
                </h1>
                <p className="text-blue-100 mt-2">
                    Post moving jobs and connect with professional packers
                </p>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-blue-50 transition-colors"
                >
                    + Create New Job
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">📋</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Your Jobs Posted</h3>
                            <p className="text-2xl font-bold text-blue-600">
                                {gigsLoading ? '...' : customerGigs.length}
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
                            <h3 className="text-lg font-medium text-gray-900">Jobs Booked</h3>
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
                            <h3 className="text-lg font-medium text-gray-900">Total Budget</h3>
                            <p className="text-2xl font-bold text-orange-600">
                                ${customerGigs.reduce((sum, gig) => sum + gig.price, 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Your Posted Jobs */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Your Moving Jobs</h2>
                    <p className="text-gray-600">Manage and track your posted moving jobs</p>
                </div>

                <div className="p-6">
                    {gigsLoading ? (
                        <div className="text-center py-8">Loading your jobs...</div>
                    ) : customerGigs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {customerGigs.map((gig) => (
                                <div key={gig.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {gig.title}
                                        </h3>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                            Open
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {gig.description}
                                    </p>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-2xl font-bold text-blue-600">
                                            ${gig.price}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-3">
                                        {gig.boxes} boxes • {new Date(gig.pickup_date).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-4">
                                        Posted {new Date(gig.created_on_date).toLocaleDateString()}
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setEditingGig(gig)}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteGig(gig.id)}
                                            disabled={deletingGigId === gig.id}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                                        >
                                            {deletingGigId === gig.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📦</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                            <p className="text-gray-500 mb-4">Create your first moving job to connect with professional packers</p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                            >
                                Create Your First Job
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button 
                            onClick={() => setShowCreateForm(true)}
                            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors"
                        >
                            <div className="text-2xl mb-2">📝</div>
                            <div className="font-medium text-blue-900">Post New Job</div>
                            <div className="text-sm text-blue-600">Create moving request</div>
                        </button>
                        
                        <button className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors">
                            <div className="text-2xl mb-2">📊</div>
                            <div className="font-medium text-green-900">Job History</div>
                            <div className="text-sm text-green-600">View past moves</div>
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

            {/* Create Gig Form Modal */}
            {showCreateForm && (
                <CreateGigForm
                    onClose={() => setShowCreateForm(false)}
                    onSuccess={handleGigCreated}
                />
            )}

            {/* Edit Gig Form Modal */}
            {editingGig && (
                <EditGigForm
                    gig={editingGig}
                    onClose={() => setEditingGig(null)}
                    onSuccess={handleGigUpdated}
                />
            )}
        </div>
    )
}

export default CustomerDashboard