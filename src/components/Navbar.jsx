import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, getData } from "../config/firebase/firebaseMethods";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
            if (userAuth) {
                // Fetch user data only if the user is logged in
                try {
                    const userData = await getData("users", userAuth.uid);
                    if (userData.length > 0) {
                        setUser(userData[0]); // Set user data if found
                    } else {
                        console.error("No user data found in Firestore!");
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                }
            } else {
                setUser(null); // User is logged out, clear user state
            }
        });

        return () => unsubscribe(); // Cleanup the listener
    }, []);

    // Logout function
    const handleLogout = async () => {
        await auth.signOut(); // Sign out the user
        setUser(null); // Clear user state
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className="navbar bg-primary px-6">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl text-white">
                    Personal Blogging App
                </Link>
            </div>
            <div className="flex-none flex items-center space-x-2">
                {user && ( // Show user data if logged in
                    <span className="text-white text-lg font-semibold cursor-pointer">
                        {user.firstName || 'User'} {user.lastName || ''}
                    </span>
                )}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            {user && user.profileImage ? (
                                <img
                                    alt={`${user.firstName || ''} ${user.lastName || ''}`}
                                    src={user.profileImage}
                                />
                            ) : (
                                <img
                                    alt="Default Avatar"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            )}
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {user ? ( // If user is logged in, show their menu
                            <>
                                <li><Link className="hover:bg-black hover:text-white" to="/profile">Profile</Link></li>
                                <li><Link className="hover:bg-black hover:text-white" to="/dashboard">Dashboard</Link></li>
                                <li><Link className="hover:bg-black hover:text-white" to="/">Blogs</Link></li>
                                <li><button className="hover:bg-black hover:text-white" onClick={handleLogout}>Logout</button></li>
                            </>
                        ) : ( // If user is not logged in, show login/signup links
                            <>
                                <li><Link className="hover:bg-black hover:text-white" to="/">Blogs</Link></li>
                                <li><Link className="hover:bg-black hover:text-white" to="/login">Login</Link></li>
                                <li><Link className="hover:bg-black hover:text-white" to="/signup">Sign Up</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
