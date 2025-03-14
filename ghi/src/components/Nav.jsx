import { NavLink } from 'react-router-dom';
import { useGetMuleQuery, useSignoutMutation } from '../app/apiSlice';

const Nav = () => {
    const { data: mule, isLoading } = useGetMuleQuery()
    const [signout, signoutStatus] = useSignoutMutation()


    if (isLoading) return <div>Loading Navbar...</div>
    return (
        <nav className="flex items-center justify-between flex-wrap bg-none-500 p-8 px-20">
            <div className="flex items-center flex-shrink-0 text-orange-500 mr-6">
                <span className="font-bold text-xl tracking-tight">
                    <NavLink to="/" className="logo cursor-pointer">
                        <img
                            src="images/packmule_logo.png"
                            width="54"
                            height="54"
                        />
                        PackMule
                    </NavLink>
                </span>
            </div>
            <ul>
                <li className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-orange-400 hover:text-orange-600">
                    <NavLink to={'/'}>Marketplace</NavLink>
                </li>
                {mule && (
                    <li className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-orange-400 hover:text-orange-600">
                        <NavLink to={'mule/gigs/booked'}>Your Gigs</NavLink>
                    </li>
                )}
                {mule && (
                    <li className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-orange-400 hover:text-orange-600">
                        <NavLink to={`/mule/${mule.id}`}>Profile</NavLink>
                    </li>
                )}
                {!mule && (
                    <li className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-orange-400 hover:text-orange-600">
                        <NavLink to={'/signup'}>Signup</NavLink>
                    </li>
                )}
                {!mule && (
                    <li className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-orange-400 hover:text-orange-600">
                        <NavLink to={'/signin'}>Login</NavLink>
                    </li>
                )}
                {mule && (
                    <li className="block mt-4 lg:inline-block lg:mt-0 text-orange-400 hover:text-orange-600 pl-4">
                        <NavLink
                            onClick={() => {
                                signout()
                            }}
                        >
                            Sign Out
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default Nav;
