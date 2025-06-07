import { useGetAllSpecialtysQuery } from "../app/apiSlice";


const SpecialtyList = () => {
    const { data: specialtys, isLoading } = useGetAllSpecialtysQuery();


    if (isLoading) {
        return <div>Loading...</div>;
    }


    return (
        <div className="specialty-wrapper">
            {specialtys.map((specialty, key) => (
                <div key={key} className="specialty-card">
                     <div className="card-body">
                        <div className="card-title">{specialty.name}</div>
                        <p>{specialty.description}</p>
                        <div className="specialty-card-details"></div>
                     </div>
                </div>
            ))}
        </div>
    );
};


export default SpecialtyList;
