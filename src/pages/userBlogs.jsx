import { useEffect, useState } from "react";
import { getData } from "../config/firebase/firebaseMethods";
import { useParams } from "react-router-dom";

export default function UserBlogs() {
    const { uid } = useParams();
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                const data = await getData("blogs", uid);
                setBlogs(data);

                const userData = await getData("users", uid);
                setUser(userData[0]); 
            } catch (error) {
                console.error("Error fetching user blogs:", error);
            }
        };

        fetchUserBlogs();
    }, [uid]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col lg:flex-row gap-6">
            {/* Blogs List Section */}
            <div className="lg:w-3/4 order-2 lg:order-1">
                <h1 className="text-3xl font-bold mb-8">User's Blogs</h1>
                <div className="space-y-6">
                    {blogs.length > 0 ? (
                        blogs.map((blog,index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4"
                            >
                                <img
                                    src={blog.imageUrl}
                                    alt={blog.title}
                                    className="w-32 h-24 md:w-40 md:h-28 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                                    <p className="text-gray-500">
                                        {blog.author} - {blog.date}
                                    </p>
                                    <p className="mt-2 text-gray-600 line-clamp-3">{blog.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No blogs found for this user.</p>
                    )}
                </div>
            </div>

            {/* User Profile Section (stays on right for large screens, moves above for small screens) */}
            {user && (
                <div className="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/4 order-1 lg:order-2 flex flex-col items-center ">
                    <img
                        src={user.profileImage}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-32 h-32 md:w-56 md:h-56 rounded-lg object-cover mb-2"
                    />
                    <h2 className="text-2xl font-semibold text-center">{`${user.firstName} ${user.lastName}`}</h2>
                    <p className="text-gray-500 text-center">{user.email}</p>
                </div>
            )}
        </div>
    );
}