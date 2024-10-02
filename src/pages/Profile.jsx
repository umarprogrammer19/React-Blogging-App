import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth, db, getData } from '../config/firebase/firebaseMethods';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const userId = currentUser.uid;
                fetchUserData(userId);
            } else {
                setUser(null);
                setBlogs([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchUserData = async (userId) => {
        setLoading(true);
        console.log("Fetching user data for user ID:", userId);
        try {
            const data = await getData("users", userId);
            console.log("Fetched user data:", data);
            setUser(data[0]);
            fetchUserBlogs(userId);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Failed to fetch user data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBlogs = async (uid) => {
        setLoading(true);
        try {
            const blogsRef = collection(db, "blogs");
            const q = query(blogsRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            const blogsData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                docId: doc.id,
            }));
            setBlogs(blogsData);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setError("Failed to fetch blogs.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex justify-center items-center h-[90vh] bg-gray-300">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>

                {user ? (
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <img
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                src={user.profileImage || "https://via.placeholder.com/150"}
                                alt="Profile"
                            />
                            <button className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full shadow-lg hover:bg-purple-600 focus:outline-none focus:ring">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </button>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">
                            {user.firstName} {user.lastName}
                        </h3>
                        <button className="text-purple-500 hover:underline focus:outline-none mt-1">
                            Edit Name
                        </button>
                    </div>
                ) : (
                    <p>No user data available</p>
                )}

                <form className="mt-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="old-password">
                            Old password
                        </label>
                        <input
                            type="password"
                            id="old-password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="Old password"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="new-password">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="New password"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="repeat-password">
                            Repeat password
                        </label>
                        <input
                            type="password"
                            id="repeat-password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="Repeat password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                    >
                        Update password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
