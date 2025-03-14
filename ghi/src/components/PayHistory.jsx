import React, { useEffect, useState } from "react";
import { useGetGigsForMuleWithStatusQuery } from "../app/apiSlice";
import { API_HOST } from "../app/apiSlice";

const PayHistory = () => {
    const [gigMuleHistory, setGigMuleHistory] = useState([]);
    const { data: gigListAll, isLoading: isListMuleLoading } = useGetGigsForMuleWithStatusQuery();

    useEffect(() => {
        if (gigListAll && gigListAll.length > 0) {
        const gigHistoryForMules = gigListAll.filter((gig) => gig.gig_status_id === 3);
        const muleId = gigHistoryForMules[0].mule_id;
        fetch(`${API_HOST}/api/users/${muleId}/gigs`, {
            method: "GET",
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            const filtered = data.filter((gig) => gig.gig_status_id === 3);
            setGigMuleHistory(filtered);
            })

        .catch((e) => console.log(e));
        }
    }, [gigListAll]);

    const getStatusString = (statusId) => {
        const statusMap = {
        1: "Pending",
        2: "Booked",
        3: "Completed",
        };
        return statusMap[statusId] || "Unknown";
    };

    if (isListMuleLoading) {
        return <div>Loading Pay History...</div>;
    }

    if (!gigListAll || gigListAll.length === 0) {
        return <div>No Pay History Available</div>;
    }

        const formatDate = (dateString) => {
        const date = new Date(dateString)
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
        return date.toLocaleDateString(undefined, options)
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        let hours = date.getHours()
        const minutes = date.getMinutes()
        const ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12
        hours = hours ? hours : 12
        const strMinutes = minutes < 10 ? '0' + minutes : minutes
        return hours + ':' + strMinutes + ' ' + ampm
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="pay-history-wrapper">
        <div className="page-header">
            <h2>Your Pay</h2>
        </div>
        <div className="table-wrapper">
            <table className="pay-history-table">
            <thead>
                <tr>
                <th scope="col" className="px-6 py-3 border-b w-2/12">Job Title</th>
                <th scope="col" className="px-6 py-3 border-b w-2/12">Description</th>
                <th scope="col" className="px-6 py-3 border-b w-2/12">Pick up Location</th>
                <th scope="col" className="px-6 py-3 border-b w-2/12"> Drop off Location</th>
                <th scope="col" className="px-6 py-3 border-b w-2/12">Date</th>
                <th scope="col" className="px-6 py-3 border-b w-2/12">Time</th>
                <th scope="col" className="px-6 py-3 border-b w-2/12">Pay</th>
                <th scope="col" className="px-6 py-3 border-b w-2/12">Status</th>
                </tr>
            </thead>
            <tbody>
                {gigMuleHistory.map((gig) => {
                return (
                    <tr key={gig.id}>
                    <td scope="col" className="px-6 py-3 border-b w-4/12">{gig.title}</td>
                    <td scope="col" className="px-6 py-3 border-b w-4/12">{gig.description}</td>
                    <td scope="col" className="px-6 py-3 border-b w-2/12">{gig.pickup_location.city}, {gig.pickup_location.state}</td>
                    <td scope="col" className="px-6 py-3 border-b w-4/12">
                        {gig.dropoff_location.city}, {gig.dropoff_location.state}
                    </td >
                    <td scope="col" className="px-6 py-3 border-b w-1/12">{formatDate(gig.pickup_date)}</td>
                    <td scope="col" className="px-6 py-3 border-b w-1/12">{formatTime(gig.pickup_date)}</td>
                    <td scope="col" className="text-right px-6 py-3 border-b  w-2/12">{formatCurrency(gig.price)}</td>
                    <td scope="col" className="px-6 py-3 border-b w-4/12">{getStatusString(gig.gig_status_id)}</td>
                    </tr>
                );
                })}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default PayHistory;
