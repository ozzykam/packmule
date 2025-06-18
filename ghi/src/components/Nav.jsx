import { NavLink } from 'react-router-dom';
import { useSignoutMutation, useCustomerSignoutMutation } from '../app/apiSlice';
import { useAuth } from '../hooks/useAuth';

const Nav = () => {
    const { isAuthenticated, userType, packer, isLoading } = useAuth()
    const [signout] = useSignoutMutation()
    const [customerSignout] = useCustomerSignoutMutation()

    const handleSignout = () => {
        if (userType === 'customer') {
            customerSignout()
        } else {
            signout()
        }
    }


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
                {userType === 'packer' && (
                <li className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-orange-400 hover:text-orange-600">
                    <NavLink to={'/marketplace'}>Marketplace</NavLink>
                </li>
                )}
                {userType === 'packer' && (
                    <li className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-orange-400 hover:text-orange-600">
                        <NavLink to={'packer/gigs/booked'}>Your Gigs</NavLink>
                    </li>
                )}
                {userType === 'packer' && (
                    <li className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-orange-400 hover:text-orange-600">
                        <NavLink to={`/packer/${packer.id}`}>Profile</NavLink>
                    </li>
                )}
                {userType === 'customer' && (
                    <li className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-blue-400 hover:text-blue-600">
                        <NavLink to={'/customer/dashboard'}>Dashboard</NavLink>
                    </li>
                )}
                {!isAuthenticated && (
                    <li className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-orange-400 hover:text-orange-600">
                        <NavLink to={'/signin'}>Packer Login</NavLink>
                    </li>
                )}
                {!isAuthenticated && (
                    <li className="block mt-4 lg:inline-block lg:mt-0 font-semibold text-blue-400 hover:text-blue-600">
                        <NavLink to={'/customer/signin'}>Customer Login</NavLink>
                    </li>
                )}
                {isAuthenticated && (
                    <li className="block mt-4 lg:inline-block lg:mt-0 text-orange-400 hover:text-orange-600 pl-4">
                        <NavLink
                            onClick={handleSignout}
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
