import { useGetBookedGigsForPackerQuery, useGetUserQuery } from "../app/apiSlice"
import { Link } from 'react-router-dom';

const GigListForPacker = () => {
    const { data: gigListForPacker, isLoading: isGigListForPackerLoading } = useGetBookedGigsForPackerQuery()
    const { data: packer, isLoading: isPackerLoading } = useGetUserQuery()

    if (isPackerLoading || isGigListForPackerLoading) {
        return <div>Loading Gigs...</div>;
    }

    if (!packer) {
        return "user must be logged in"
    }

    if (!gigListForPacker) {
        return ""
    }

    const featuredImage = (gig) => {
        const defaultImage =
            'https://images01.military.com/sites/default/files/styles/full/public/2023-08/stock%20moving%20boxes%20and%20plants%201800%20x%201200.jpg'
        if (
            gig.images &&
            gig.images.length > 1 &&
            gig.featured_image_index !== null
        ) {
            return gig.images[gig.featured_image_index]
        } else if (gig.images && gig.images.length === 1) {
            return gig.images[0]
        }
        return defaultImage
    }

    return (
        <>
            <div>
                <h1>
                    Your Booked Gigs
                </h1>
            </div>
            <div className="gigs-wrapper flex">
                {gigListForPacker.map(gig => (
                    <Link to={`/gig/${gig.id}`} className="no-hyperlink" key={gig.id}>
                        <div className="gig-card">
                            <div className="card-body hover:brightness-[1.1] transition duration-300 ease-in-out">
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
        </>
    );
}

export default GigListForPacker;
