import { useGetAllGigsQuery, useGetBookedGigsForMuleQuery, useGetMuleQuery } from "../app/apiSlice"
import { Link } from 'react-router-dom';

const GigListForMule = () => {
    const { data: gigListForMule, isLoading: isGigListForMuleLoading } = useGetBookedGigsForMuleQuery()
    const { data: mule, isLoading: isMuleLoading } = useGetMuleQuery()

    if (isMuleLoading || isGigListForMuleLoading) {
        return <div>Loading Gigs...</div>;
    }

    if (!mule) {
        return "user must be logged in"
    }

    if (!gigListForMule) {
        return ""
    }

    return (
        <div>
        <div>
            <h1>
                Your Booked Gigs
            </h1>
        </div>
        <div className="gigs-wrapper flex">
            {gigListForMule.map(gig => (
                <Link to={`/gig/${gig.id}`} className="no-hyperlink" key={gig.id}>
                    <div className="gig-card">
                        <div className="card-body hover:brightness-[1.1] transition duration-300 ease-in-out">
                            <img src="https://images01.military.com/sites/default/files/styles/full/public/2023-08/stock%20moving%20boxes%20and%20plants%201800%20x%201200.jpg"
                            alt="Gig" />
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

export default GigListForMule;
