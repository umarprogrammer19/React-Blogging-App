import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, getData } from "../config/firebase/firebaseMethods";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
            if (userAuth) {
                try {
                    const userData = await getData("users", userAuth.uid);
                    if (userData.length > 0) {
                        setUser(userData[0]); 
                    } else {
                        console.error("No user data found!");
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); 
    }, []);

    const handleLogout = async () => {
        await auth.signOut(); 
        setUser(null); 
        navigate("/login"); 
    };

    return (
        <nav className="navbar bg-primary px-4 sm:px-6">
            <div className="flex-1">
                <Link to="/" className="text-xl font-semibold text-white">
                    Blogging App
                </Link>
            </div>
            <div className="flex-none flex items-center space-x-2">
                {user && (
                    <span className="hidden sm:inline-block text-white text-lg font-semibold">
                        {user.firstName || 'User'} {user.lastName || ''}
                    </span>
                )}
                <div className="dropdown dropdown-end">
                    <button
                        tabIndex={0}
                        className="btn btn-ghost btn-circle avatar focus:outline-none"
                        aria-label="User Menu"
                    >
                        <div className="w-10 rounded-full">
                            {user && user.profileImage ? (
                                <img
                                    alt={`${user.firstName || ''} ${user.lastName || ''}`}
                                    src={user.profileImage}
                                    className="rounded-full"
                                />
                            ) : (
                                <img
                                    alt="Default Avatar"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                    className="rounded-full"
                                />
                            )}
                        </div>
                    </button>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow mt-3 w-52 p-2 z-10"
                        role="menu"
                    >
                        {user ? (
                            <>
                                <li>
                                    <Link className="hover:bg-black hover:text-white" to="/profile">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:bg-black hover:text-white" to="/dashboard">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:bg-black hover:text-white" to="/">
                                        Blogs
                                    </Link>
                                </li>
                                <li>
                                    <button className="hover:bg-black hover:text-white" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link className="hover:bg-black hover:text-white" to="/">
                                        Blogs
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:bg-black hover:text-white" to="/login">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link className="hover:bg-black hover:text-white" to="/signup">
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
