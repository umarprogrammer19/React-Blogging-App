import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, getData } from "../config/firebase/firebaseMethods"; 

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
            if (userAuth) {
                const userData = await getData("users", userAuth.uid);
                setUser(userData[0]); 
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
        <div className="navbar bg-primary px-6">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl text-white">Personal Blogging App</a>
            </div>
            <div className="flex-none flex items-center space-x-2">
                {user && (
                    <span className="text-white text-lg font-semibold cursor-pointer`">
                        {user.firstName} {user.lastName}
                    </span>
                )}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            {user ? (
                                <img
                                    alt={`${user.firstName} ${user.lastName}`}
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
                        {user ? (
                            <>
                                <li><Link className="hover:bg-black hover:text-white" to={"/dashboard"}>Dashboard</Link></li>
                                <li><Link className="hover:bg-black hover:text-white" to={"/"}>Blogs</Link></li>
                                <li><button className="hover:bg-black hover:text-white" onClick={handleLogout}>Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li><Link className="hover:bg-black hover:text-white" to={"/login"}>Login</Link></li>
                                <li><Link className="hover:bg-black hover:text-white" to={"/signup"}>Sign Up</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
