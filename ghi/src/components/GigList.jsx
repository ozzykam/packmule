import { useGetAllGigsQuery, useGetGigsForPackersListQuery} from "../app/apiSlice"
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const GigList = () => {
    const { data: gigDetailList, isLoading: isGigDetailListLoading, refetch: refectchUseGetAllGigsQuery } = useGetAllGigsQuery()
    const { data: gigList, isLoading: isGigListLoading, refetch: refectchUseGetGigsForPackersQuery } = useGetGigsForPackersListQuery()

    useEffect(() => {
        refectchUseGetAllGigsQuery()
        refectchUseGetGigsForPackersQuery()
    }, [refectchUseGetAllGigsQuery, refectchUseGetGigsForPackersQuery])


    if (isGigDetailListLoading || isGigListLoading ) {
        return <div>Loading Gigs...</div>;
    }

    // Add safety checks for undefined data
    if (!gigList || !gigDetailList) {
        return <div>Unable to load gigs. Please try again later.</div>;
    }

    const bookedGigs = gigList.map(gig => gig.gig_id)
    const openGigs = gigDetailList.filter( gig => !bookedGigs.includes(gig.id))
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
        <div>
        <div>
            <h1>
                Gig Marketplace
            </h1>
        </div>
        <div className="gigs-wrapper">
            {openGigs.map(gig => (
                <Link to={`/gig/${gig.id}`} className="no-hyperlink" key={gig.id}>
                    <div className="gig-card">
                        <div className="card-body hover:brightness-[1.1] transition duration-300 ease-in-out">
                            {}
                            <img src={featuredImage(gig)}
                            alt={gig.title} />
                            <div className="gig-card-details">
                                <div className="card-title"><strong>{gig.title}</strong></div>
                                <div className="gig-card-detail-location">{gig.pickup_location.city}, {gig.pickup_location.state}</div>
                                <div className="gig-card-detail-boxes-price">
                                    <div className="gig-card-detail-boxes">{gig.boxes} Boxes</div>
                                    <div className="gig-card-detail-price"><strong>${gig.price}</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
        </div>
    );
}

export default GigList;
