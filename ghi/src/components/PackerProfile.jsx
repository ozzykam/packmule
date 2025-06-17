import { useParams, Link } from "react-router-dom"
import { useGetPackerProfileQuery, useGetPackerQuery, useListSpecialtiesForPackerQuery } from "../app/apiSlice"
import SignInForm from "./SignInForm";

const PackerProfile = () => {
    const params = useParams();
    const {data: user_logged, isLoading: isUserLoggedLoading } = useGetPackerQuery()
    const {data: packer, isLoading: isPackerLoading } = useGetPackerProfileQuery()
    const {data: packer_specialties, isLoading: isPackerSpecialtysLoading } = useListSpecialtiesForPackerQuery(params.packerId)

    if (isUserLoggedLoading || isPackerLoading || isPackerSpecialtysLoading) {
        return <div>Loading...</div>
    }

    if (!packer) {
        return (
            <>
                <div className="mx-auto w-1/2 p-4">
                    <h1> Please log in or sign up to continue!</h1>
                </div>
                <div>
                    <SignInForm />
                    <SignInForm />
                </div>
            </>
        )
    }

    let equipmentSpecialties = [];
    let experienceSpecialties = [];
    let vehicleSpecialties = [];

    if (packer_specialties && packer_specialties.length > 0) {
        equipmentSpecialties = packer_specialties.filter(specialty => specialty.specialty_type_id === 1);
        experienceSpecialties = packer_specialties.filter(specialty => specialty.specialty_type_id === 2);
        vehicleSpecialties = packer_specialties.filter(specialty => specialty.specialty_type_id === 3);
    }
    console.log(equipmentSpecialties)

    return (
        <>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <div className="flex flex-wrap ml-8">
                        <h2 className="ml-0 w-full">
                            Welcome, {packer.username}
                        </h2>
                        <div className="font-semibold w-full">Email</div>
                        <div className="pb-5 w-full">{packer.email}</div>
                        <div className="font-semibold w-full">Phone</div>
                        <div className="pb-5 w-full">{packer.phone}</div>
                        <div className="font-semibold w-full">Bio</div>
                        <div className="pb-5 w-full">{packer.bio}</div>
                        <button
                            className="bg-gradient-to-br from-orange-600 to-orange-400 text-white
                                font-bold py-4 px-8 rounded-full shadow-[0_10px_20px_-9px_rgba(227,136,0,1)] focus:outline-none
                                focus:shadow-outline hover:brightness-[1.05] hover:scale-[1.03]
                                hover:shadow-[0_35px_60px_-9px_rgba(227,136,0,0.7)]
                                transition duration-200 ease-in-out "
                        >
                            <Link to="/packer/edit">Edit Profile</Link>
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <div>
                        <h2 className="ml-0 w-full">Packer Specialties</h2>
                        <div>
                            {equipmentSpecialties.length > 0 && (
                                <>
                                    <div className="font-semibold pb-4">Tools</div>
                                        <p className="gig_specialty_list_horizontal flex-wrap">
                                            {equipmentSpecialties.map(
                                                (specialty, counter) => (
                                                    <li
                                                        key={specialty.id}
                                                        className="bg-gray-950 text-white
                                                        py-2 px-4 mb-8 rounded-full focus:outline-none
                                                        focus:shadow-outline"
                                                    >
                                                        {specialty.specialty_name}
                                                        {counter <
                                                            equipmentSpecialties.length -
                                                                1 && ''}
                                                    </li>
                                                )
                                            )}
                                        </p>
                                    </>
                            )}
                        </div>
                    </div>
                    <div>
                        {experienceSpecialties.length > 0 && (
                            <>
                                <div className="font-semibold pb-4">Experience</div>
                                    <p className="gig_specialty_list_horizontal flex-wrap">
                                        {experienceSpecialties.map(
                                            (specialty, counter) => (
                                                <li
                                                    key={specialty.id}
                                                    className="bg-gray-950 text-white
                                                        py-2 px-4 mb-8 rounded-full focus:outline-none
                                                        focus:shadow-outline"
                                                >
                                                    {specialty.specialty_name}
                                                    {counter <
                                                        experienceSpecialties.length -
                                                            1 && ''}
                                                </li>
                                            )
                                        )}
                                    </p>
                            </>
                        )}
                    </div>
                    <div>
                        {vehicleSpecialties.length > 0 && (
                            <>
                            <div className="font-semibold pb-4">Vehicle</div>
                            <p className="gig_specialty_list_horizontal flex-wrap">
                                {vehicleSpecialties.map(
                                    (specialty, counter) => (
                                        <li
                                            key={specialty.id}
                                            className="bg-gray-950 text-white
                                                py-2 px-4 mb-8 rounded-full focus:outline-none
                                                focus:shadow-outline"
                                        >
                                            {specialty.specialty_name}
                                            {counter <
                                                vehicleSpecialties.length - 1 &&
                                                ''}
                                        </li>
                                    )
                                )}
                            </p>
                            </>
                        )}
                    </div>
                    <button
                        className="bg-gradient-to-br from-orange-600 to-orange-400 text-white
                            font-bold py-4 px-8 mb-8 rounded-full shadow-[0_10px_20px_-9px_rgba(227,136,0,1)] focus:outline-none
                            focus:shadow-outline hover:brightness-[1.05] hover:scale-[1.03]
                            hover:shadow-[0_35px_60px_-9px_rgba(227,136,0,0.7)]
                            transition duration-200 ease-in-out"
                    >
                        <Link to={`/packer/${user_logged.id}/specialtys/edit`}>
                            Add or Edit Specialties
                        </Link>
                    </button>
                </div>
            </div>
        </>
    )
}

export default PackerProfile
